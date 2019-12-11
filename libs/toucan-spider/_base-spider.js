// 页面蜘蛛
//
// 功能描述：
// 从来源读取需要抓取的网页地址（抓取任务）
// 抓取网页内容
// 按照设置解析网页中的链接，并且存入指定位置
// 按照设置将页面内容存入指定位置
// 按照设置自动获取下一个抓取任务
// 触发抓取任务完成，抓取任务异常事件
//
//

const _ = require('lodash');

const { sleep, exURL, exHTML, exCookie, SiteUrlCount } = require('../toucan-utility');
const { NullArgumentError } = require('../toucan-error');
const TargetUrlPool = require('./_layer-url-task-pool');
const cheerio = require("cheerio");

class ToucanBaseSpider {

    // 构造页面蜘蛛
    constructor({
        // 蜘蛛的名称         
        spiderName,
        // 蜘蛛的类型
        spiderType,
        // 空闲的时候，暂停的时间
        idleSleep,
        // 只保存页面的文本
        onlyKeepPageText = false,
        // cookies
        cookie = '',
    } = {}) {
        this._self = this;

        //
        // 设置属性的默认值
        //
        this.spiderName = spiderName || 'unknown';
        this.spiderType = spiderType || 'unknown';
        this.idleSleep = idleSleep || 1000;

        //
        // 蜘蛛的选项
        //
        this.onlyKeepPageText = onlyKeepPageText;
        // 初始化的cookies
        this.cookie = new exCookie(cookie);

        // 保留所有的原始选项
        this.options = arguments[0];
        // 任务完成的处理程序
        //this.onTaskDone = onTaskDone;
    }

    // 执行一个抓取任务
    async run(
        // 采集任务的参数
        task,
        // 提交采集的结果
        submitGatherResult) {

        const {
            targetUrl,
            // 0    - 爬当前层
            // -1   - 爬所有层（不超过系统指定的上限）
            depth = 0,
            // 任务中的页面暂停
            turnPageSleep,
            // 开始的页面位置
            startPageIndex = 0,
        } = task;
        // 设置最大的爬行层
        const maxLayerIndex = depth < 0 ? 20 : depth;

        // 参数验证
        if (_.isEmpty(targetUrl)) throw new NullArgumentError('targetUrl');

        // 构建连接池，管理爬行的连接
        this._targetUrlPool = new TargetUrlPool(targetUrl, startPageIndex);

        // 任务开始时间
        const theTask = Object.assign(task, {
            taskBeginTime: _.now(),
            taskDonePageCount: 0,
            taskErrorPageCount: 0,
            extractUrlTotalCount: SiteUrlCount(),
            extractUrlErrorCount: 0,
            depth: maxLayerIndex,
        },
            // 启动的选项作为任务的参数
            this.options);
        // 爬行的循环
        let layerIndex = startPageIndex;
        while (layerIndex <= maxLayerIndex) {

            // 防止爬行过快
            await sleep(turnPageSleep || this.idleSleep);

            // 从连接池中获取当前爬行层的一个连接
            const url = this._targetUrlPool.pop(layerIndex);
            if (_.isEmpty(url)) break;

            // 设置页面对象
            let thePage = {
                pageUrl: url,
                pageBeginTime: _.now(),
                pageLayerIndex: layerIndex,
                spiderName: this.spiderName,
                spiderType: this.spiderType
            }

            try {

                const {
                    crawlResult,
                    extractUrlResult = { urlCountInPage: SiteUrlCount(), extractUrlSuccess: false }
                } = await this.crawlOnePage(theTask, thePage, layerIndex);

                // 页面链接的解析结果
                thePage = Object.assign(thePage, extractUrlResult);
                // 纪录页面的链接数量
                theTask.extractUrlTotalCount = theTask.extractUrlTotalCount.add(extractUrlResult.urlCountInPage);
                // 纪录解析错误的次数
                theTask.extractUrlErrorCount = theTask.extractUrlErrorCount + extractUrlResult.extractUrlSuccess ? 0 : 1;

                // 采集的结果
                if (crawlResult.hasException) {
                    //  采集失败的页面数量增加
                    theTask.taskErrorPageCount = theTask.taskErrorPageCount + 1;
                } else {
                    //  采集成功的页面数量增加
                    theTask.taskDonePageCount = theTask.taskDonePageCount + 1;
                }
                // 计算任务计划要采集的估计数量
                theTask.taskPlanPageCount = this._targetUrlPool.sumLessThan(layerIndex);

                // 触发一个页面完成
                await this.onPageDone(false, theTask, thePage, crawlResult, submitGatherResult);
            }
            catch (error) {
                // 触发一个页面异常
                theTask.taskErrorPageCount = theTask.taskErrorPageCount + 1;
                await this.onPageDone(true, theTask, thePage, error, submitGatherResult);
            }

            // 是否有同层的连接？
            if (this._targetUrlPool.residualCount(layerIndex) === 0) {
                // 如果没有同层的连接时，开始爬行下一层，如果有则继续保持同层
                // 设置下一层的连接
                layerIndex = layerIndex + 1;
            }

        }

        // 设置任务完成得信息
        return this.onTaskDone(theTask);

    }

    // 爬行一个页面
    async crawlOnePage(theTask, thePage, layerIndex = 0) {
        // 加入cookie管理
        if (!_.isNil(this.cookie)) theTask = Object.assign(theTask, { requestCookie: this.cookie.toString() });

        // 获得页面的采集结果
        const response = await this.pageFetch.do(exURL.fillProtocol(thePage.pageUrl), theTask);

        // 提取cookie
        const { responseCookie } = response;
        if (!_.isNil(this.cookie) && !_.isNil(responseCookie)) this.cookie.setCookie(responseCookie);

        // 解析列表的链接
        const extractUrlResult = this.extractUrl(thePage, response, layerIndex);

        // 处理页面中实体字符
        response.pageContent = exHTML.htmlDecode(response.pageContent);

        // 是否需要提取文本的内容
        if (this.onlyKeepPageText && !_.isNil(response)) {
            response.pageContent = exHTML.extractContent(response.pageContent, true);
        }

        return { crawlResult: response, extractUrlResult };
    }

    // 解析页面中的url
    extractUrl(thePage, response, layerIndex) {
        // 解析页面的结果
        const extractUrlResult = {
            urlCountInPage: {},
            extractUrlSuccess: false
        }

        try {
            // 解析页面中的下级链接
            extractUrlResult.urlCountInPage = this.analyzeSiteUrlCount(thePage.pageUrl, response.pageContent, layerIndex);
            extractUrlResult.extractUrlSuccess = true;
        }
        catch (error) {
            extractUrlResult.extractUrlError = error;
        }

        return extractUrlResult;
    }

    // 分析站点链接的数量
    analyzeSiteUrlCount(pageUrl, content, layerIndex) {
        let urlCount = SiteUrlCount();
        const $ = cheerio.load(content);
        _.forEach($('a'), (x) => {
            const url = x.attribs.href
            // 提前链接的属于当前层的下一层，所以layerIndex需要+1
            if (exURL.isSameHost(pageUrl, url)) {
                urlCount.innerUrl = urlCount.innerUrl + this._targetUrlPool.push(url, layerIndex + 1);
            } else if (exURL.isScript(url)) {
                urlCount.scriptUrl = urlCount.scriptUrl + 1;
            }
            else {
                urlCount.outerUrl = urlCount.outerUrl + 1;
            }
        });
        return urlCount;
    }

    // 触发页面完成的事件
    async  onPageDone(hasException, theTask, thePage, result, eventCallback) {

        const pageEndTime = _.now();
        const pageSpendTime = pageEndTime - thePage.pageBeginTime;
        const taskSpendTime = pageEndTime - theTask.taskBeginTime;

        thePage = Object.assign(thePage, { hasException, pageEndTime, pageSpendTime }, result)
        theTask = Object.assign(theTask, { taskSpendTime });

        if (typeof eventCallback === 'function') {
            // 事件回调
            await eventCallback({ task: theTask, page: thePage })
        }
        else {
            let msg = `${thePage.spiderName}[${thePage.spiderType}]: ${hasException ? '任务异常' : '任务完成'}。`
            msg = `***** 没有发现可用的 eventCallback ***** \r\n ${msg}`;
            console.log(msg, result);
        }

    }

    // 触发任务完成的事件
    onTaskDone(task) {
        const taskEndTime = _.now();
        const taskSpendTime = taskEndTime - task.taskBeginTime;

        return Object.assign(task, { taskEndTime, taskSpendTime })
    }
}



module.exports = { ToucanBaseSpider };