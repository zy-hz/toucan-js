//
// 采集任务管理中心
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../toucan-work-unit')
const { StatusCode } = require('../toucan-utility');
const mqFactory = require('../toucan-message-queue');
const PublishGatherTaskJob = require('./_job-publish-gather-task');

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

        try {
            // 启动消息队列的连接
            await this.taskMQ.connect();

            // 构建定时作业
            const pgtJob = new PublishGatherTaskJob({ taskMQ: this.taskMQ })

            // 启动定时作业
            this.schedule = schedule.scheduleJob('*/5 * * * * *', async () => {
                await pgtJob.do('schedule');
            })

            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        }
        catch (error) {
            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
        }
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