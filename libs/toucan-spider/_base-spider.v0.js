// 页面蜘蛛 (测试版本)
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

    // 蜘蛛开始运行
    async start() {
        // 强制停止标记
        this.forceStop = false;

        try {
            // 设置正在运行的标记
            this.isRunning = true;
            // 运行体
            while (!this.forceStop) {

                await sleep(this.idleSleep);
            }
        }
        finally {
            this.isRunning = false
        }

    }

    // 停止蜘蛛的工作
    async stop({
        // 延时停止的毫秒
        delay = 10,
        // 等待蜘蛛停止成功。0 表示不等待, -1 表示一直等待，其他整数表示等待的毫秒
        expectWaitMillionSecond = -1
    } = {}) {
        await sleep(delay);
        // 设置停止标记
        this.forceStop = true;

        // 如果 -1 表示一直等待，设置为一天
        expectWaitMillionSecond = expectWaitMillionSecond === -1 ? 1000 * 60 * 60 * 24 : expectWaitMillionSecond;
        // 等待的毫秒
        let waitMillionSecond = 0
        while (this.isRunning && waitMillionSecond < expectWaitMillionSecond) {

            await sleep(100);
            waitMillionSecond = waitMillionSecond + 100;
        }
    }

    // 执行一个抓取任务
    async do(task = {}) {
        const {
            targetUrl,
            // 可以指定任务运行时的完成处理
            onTaskDone = this.onTaskDone,
        } = task;

        // 任务开始时间
        task = Object.assign(task, { taskBeginTime: _.now() })
        try {
            // 参数验证
            if (_.isEmpty(targetUrl)) throw new NullArgumentError('targetUrl');

            // 获得页面的采集结果
            const response = await this.pageFetch.do(targetUrl)

            // 触发任务完成的事件
            triggleTaskDoneEvent(false, this._self, task, response, onTaskDone)
        }
        catch (error) {
            // 触发任务完成的事件
            triggleTaskDoneEvent(true, this._self, task, error, onTaskDone)
        }

    }

}

// 触发任务完成得事件
function triggleTaskDoneEvent(hasException, taskSpider, task, result, eventCallback) {

    const taskEndTime = _.now();
    const taskSpendTime = taskEndTime - task.taskBeginTime;

    task = Object.assign(task, { hasException, taskEndTime, taskSpendTime, taskSpider, taskResult: result })

    if (typeof eventCallback === 'function') {
        // 事件回调
        eventCallback(task)
    }
    else {
        let msg = `${getObjectClassName(taskSpider)} ${taskSpider.spiderName}[${taskSpider.spiderType}]: ${hasException ? '任务异常' : '任务完成'}。`
        msg = `***** 没有发现可用的 eventCallback ***** \r\n ${msg}`;
        console.log(msg, result);
    }

}

module.exports = { ToucanBaseSpider };