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

class ToucanPageSpider {

    // 构造页面蜘蛛
    constructor({
        // 蜘蛛的名称         
        spiderName,
        // 蜘蛛的类型
        spiderType,
        // 空闲的时候，暂停的时间
        idleSleep,
        // 触发获取任务的回掉
        onGetTask,
        // 任务完成
        onTaskDone,
        // 任务发生异常
        onTaskException,
    } = {}) {
        this._self = this;

        //
        // 设置属性的默认值
        //
        this.spiderName = spiderName || 'unknown';
        this.spiderType = spiderType;
        this.idleSleep = idleSleep || 1000;

        // 默认使用日志纪录器
        this.onTaskDone = onTaskDone || defaultOnTaskDone;
        this.onTaskException = onTaskException || defaultOnTaskException;
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
            taskUrl,
            // 可以指定任务运行时的完成处理
            onTaskDone = this.onTaskDone,
            // 可以指定任务运行时的错误处理器，用于调试
            onTaskException = this.onTaskException
        } = task;

        try {
            // 参数验证
            if (_.isEmpty(taskUrl)) throw new NullArgumentError('taskUrl');

            // 获得页面的采集结果
            const response = await this.pageFetch.do(taskUrl)

            // 任务完成
            let result = Object.assign(response, { task, taskSpider: this._self })
            onTaskDone(result);
        }
        catch (error) {
            // 设置异常关联的任务
            onTaskException(Object.assign(error, { task, taskSpider: this._self }))
        }

    }

}

// 默认的任务处理
function defaultOnTaskDone(args) {
    defaultTaskLog('任务完成',args);
}

// 默认的异常处理
function defaultOnTaskException(args){
    defaultTaskLog('任务异常',args);
}

function defaultTaskLog(message,args){
    const { taskSpider } = args;
    const msg = `${getObjectClassName(taskSpider)} ${taskSpider.spiderName}[${taskSpider.spiderType}]: ${message}。`
    console.log(msg, args);
}

module.exports = ToucanPageSpider;