//
// 自动运行- 定时发布采集任务
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../../../toucan-work-unit');
const { StatusCode } = require('../../../toucan-utility');
const { PublishGatherTaskJob } = require('../../../toucan-job');

const mqFactory = require('../../../toucan-message-queue');
const tvFactory = require('../../../toucan-task-visitor');

class PublishGatherTaskRunner extends ToucanWorkUnit {

    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async init(options = {}) {
        // 获得参数
        const { taskMQ, taskSource } = options;

        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ(taskMQ.mqType, taskMQ.options);
        // 指定交换机
        this.exchange = taskMQ.exchangeName;

        // 创建任务读取接口
        // 目前支持一个任务读取器，后面可以支持多个
        this.taskV = tvFactory.create(taskSource[0]);
    }

    // 启动
    async start(options = {}) {

        try {
            const { batchPublishCount = 1 } = options;

            // 初始化运行者
            await this.init(options);

            // 启动消息队列的连接
            await this.taskMQ.connect();

            // 构建定时作业
            const pgtJob = new PublishGatherTaskJob({ taskMQ: this.taskMQ, taskV: this.taskV, exchange: this.exchange })

            // 启动定时作业
            this.schedule = schedule.scheduleJob('*/5 * * * * *', async () => {
                await pgtJob.do({ maxCount: batchPublishCount });
            })

            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        }
        catch (error) {
            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
            // 
            this.error('PublishGatherTaskRunner工作异常', error);
        }
    }

    // 停止
    async stop() {
        // 关闭定时器
        if (!_.isNil(this.schedule)) this.schedule.cancel();
        // 关闭消息队列
        await this.taskMQ.disconnect();
        // 更新工作状态
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }
}

module.exports = new PublishGatherTaskRunner();