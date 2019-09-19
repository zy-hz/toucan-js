//
// 采集任务管理中心
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../toucan-work-unit')
const { StatusCode } = require('../toucan-utility');
const mqFactory = require('../toucan-message-queue');
const PublishTaskJob = require('./_job-publish-task');

class GatherTaskCenter extends ToucanWorkUnit {

    constructor(cfgFileName = '') {
        // 工作单元的状态
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async init(autoStart = true) {
        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ('rabbit');

        // 自动启动
        if (autoStart) await this.start();
    }

    async start() {

        await this.taskMQ.connect();
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);

        const ptJob = new PublishTaskJob({ taskMQ: this.taskMQ })

        this.schedule = schedule.scheduleJob('*/5 * * * * *', async () => {
            await ptJob.do('schedule');
        })
    }

    async stop() {
        // 关闭定时器
        if (!_.isNil(this.schedule)) this.schedule.cancel();
        // 关闭消息队列
        await this.taskMQ.disconnect();
        // 更新工作状态
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }

}

module.exports = GatherTaskCenter;