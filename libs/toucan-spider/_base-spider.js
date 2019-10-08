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

const { sleep, exURL, SiteUrlCount } = require('../toucan-utility');
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
    } = {}) {
        this._self = this;

        //
        // 设置属性的默认值
        //
        this.spiderName = spiderName || 'unknown';
        this.spiderType = spiderType;
        this.idleSleep = idleSleep || 1000;

        // 任务完成的处理程序
        this.onTaskDone = onTaskDone;
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
            depth = 0
        } = task;
        // 设置最大的爬行层
        const maxLayerIndex = depth < 0 ? 20 : depth;

        // 参数验证
        if (_.isEmpty(targetUrl)) throw new NullArgumentError('targetUrl');

        // 构建连接池，管理爬行的连接
        this._targetUrlPool = new TargetUrlPool(targetUrl, 0);

        // 任务开始时间
        const theTask = Object.assign(task, {
            taskBeginTime: _.now(),
            taskDonePageCount: 0,
            taskErrorPageCount: 0,
            extractUrlTotalCount: SiteUrlCount(),
            extractUrlErrorCount: 0,
        });
        // 爬行的循环
        let layerIndex = 0;
        while (layerIndex <= maxLayerIndex) {

            // 防止爬行过快
            await sleep(this.idleSleep);

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
                theTask.extractUrlTotalCount.add(extractUrlResult.urlCountInPage);
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

                // 触发一个页面完成
                await onPageDone(false, theTask, thePage, crawlResult, submitGatherResult);
            }
            catch (error) {
                // 触发一个页面异常
                theTask.taskErrorPageCount = theTask.taskErrorPageCount + 1;
                await onPageDone(true, theTask, thePage, error, submitGatherResult);
            }

            // 是否有同层的连接？
            if (this._targetUrlPool.residualCount(layerIndex) === 0) {
                // 如果没有同层的连接时，开始爬行下一层，如果有则继续保持同层
                // 设置下一层的连接
                layerIndex = layerIndex + 1;
            }

        }

        // 设置任务完成得信息
        return onTaskDone(theTask);

    }

    // 爬行一个页面
    async crawlOnePage(theTask, thePage, layerIndex = 0) {
        // 获得页面的采集结果
        const response = await this.pageFetch.do(exURL.fillProtocol(thePage.pageUrl));

        // 解析页面的结果
        const extractUrlResult = {
            urlCountInPage: {},
            extractUrlSuccess: false
        }

        try {
            // 解析页面中的下级链接
            extractUrlResult.urlCountInPage = this.extractUrl(thePage.pageUrl, response.pageContent, layerIndex);
            extractUrlResult.extractUrlSuccess = true;
        }
        catch (error) {
            extractUrlResult.extractUrlError = error;

        }

        return { crawlResult: response, extractUrlResult };
    }

    // 从页面中提取链接
    extractUrl(pageUrl, content, layerIndex) {
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

}

// 触发页面完成的事件
async function onPageDone(hasException, theTask, thePage, result, eventCallback) {

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
function onTaskDone(task) {
    const taskEndTime = _.now();
    const taskSpendTime = taskEndTime - task.taskBeginTime;

    return Object.assign(task, { taskEndTime, taskSpendTime })
}

module.exports = { ToucanBaseSpider };