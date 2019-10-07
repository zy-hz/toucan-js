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

        const { targetUrl, depth = 0 } = task;

        // 任务开始时间
        task = Object.assign(task, { taskBeginTime: _.now() })
        try {
            // 参数验证
            if (_.isEmpty(targetUrl)) throw new NullArgumentError('targetUrl');

            // 获得页面的采集结果
            const response = await this.pageFetch.do(targetUrl)

            // 触发任务完成的事件
            await triggleTaskDoneEvent(false, this._self, task, response, submitGatherResult)
        }
        catch (error) {
            // 触发任务完成的事件
            await triggleTaskDoneEvent(true, this._self, task, error, submitGatherResult)
        }

    }

}

// 触发任务完成得事件
async function triggleTaskDoneEvent(hasException, taskSpider, task, result, eventCallback) {

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

module.exports = { ToucanBaseSpider };