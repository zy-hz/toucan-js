//
// 采集任务管理中心
//
const schedule = require('node-schedule');

const { ToucanWorkUnit } = require('../toucan-work-unit')
const { StatusCode } = require('../toucan-utility');
const mqFactory = require('../toucan-message-queue');

class GatherTaskCenter extends ToucanWorkUnit {

    constructor(cfgFileName = '') {
        // 工作单元的状态
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async start() {
        await this._init();
        await this.taskMQ.connect();
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);

        // 每天的凌晨1点15分30秒触发
        this.schedule = schedule.scheduleJob('*/2 8 * * * *', async () => {
            console.log('aaa');
        })
    }

    // 初始化
    async _init() {
        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ('rabbit');
    }

    async stop() {
        // 关闭定时器
        this.schedule.cancel();
        // 关闭消息队列
        await this.taskMQ.disconnect();
        // 更新工作状态
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }
}

module.exports = GatherTaskCenter;