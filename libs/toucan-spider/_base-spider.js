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

const { sleep, getObjectClassName } = require('../toucan-utility');
const { NullArgumentError } = require('../toucan-error');
const TargetUrlPool = require('./_target-url-pool');

class ToucanBaseSpider {

    // 构造页面蜘蛛
    constructor({
        // 蜘蛛的名称         
        spiderName,
        // 蜘蛛的类型
        spiderType,
        // 空闲的时候，暂停的时间
        idleSleep,
        // 任务完成，
        onTaskDone,
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
        const theTask = Object.assign(task, { taskBeginTime: _.now(), taskDonePageCount: 0, taskErrorPageCount: 0 })
        // 爬行的循环
        let layerIndex = 0;
        while (layerIndex <= maxLayerIndex) {

            // 从连接池中获取当前爬行层的一个连接
            const url = this._targetUrlPool.pop(layerIndex);
            if (_.isEmpty(url)) break;

            // 是否有同层的连接？
            if (!this._targetUrlPool.hasUrl(layerIndex)) {
                // 如果没有同层的连接时，开始爬行下一层，如果有则继续保持同层
                // 设置下一层的连接
                layerIndex = layerIndex + 1;
            }

            // 设置页面对象
            const thePage = {
                pageUrl: url,
                pageBeginTime: _.now()
            }

            try {
                await this.crawlOnePage(thePage, theTask, submitGatherResult);
            }
            catch (error) {
                // 触发一个页面异常
                await onPageDone(true, theTask, thePage, error, submitGatherResult);
            }

        }

        // 设置任务完成得信息
        return onTaskDone(theTask);

    }

    // 爬行一个页面
    async crawlOnePage(thePage, theTask, submitGatherResult) {
        // 获得页面的采集结果
        const response = await this.pageFetch.do(thePage.pageUrl);

        // 触发一个页面完成
        await onPageDone(false, theTask, thePage, response, submitGatherResult);
    }
}

// 触发任务完成得事件
async function onPageDone(hasException, taskSpider, task, result, eventCallback) {

    const taskEndTime = _.now();
    const taskSpendTime = taskEndTime - task.taskBeginTime;

    task = Object.assign(task, { hasException, taskEndTime, taskSpendTime, taskSpider, taskResult: result })

    if (typeof eventCallback === 'function') {
        // 事件回调
        await eventCallback(task)
    }
    else {
        let msg = `${getObjectClassName(taskSpider)} ${taskSpider.spiderName}[${taskSpider.spiderType}]: ${hasException ? '任务异常' : '任务完成'}。`
        msg = `***** 没有发现可用的 eventCallback ***** \r\n ${msg}`;
        console.log(msg, result);
    }

}

function onTaskDone(task) {
    const taskEndTime = _.now();
    const taskSpendTime = taskEndTime - task.taskBeginTime;

    return Object.assign(task, { taskEndTime, taskSpendTime })
}

module.exports = { ToucanBaseSpider };