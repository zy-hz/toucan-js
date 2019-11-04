//
// 自动运行- 定时回收采集结果
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../../../toucan-work-unit');
const { StatusCode } = require('../../../toucan-utility');
const { RegainGatherResultJob } = require('../../../toucan-job');

const mqFactory = require('../../../toucan-message-queue');

class RegainGatherResultRunner extends ToucanWorkUnit {

    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async init(options = {}) {
        // 获得参数
        const { taskMQ, jobSchedule = { regainGatherResult: '0 * * * * *' }, batchRegainCount = 25 } = options;

        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ(taskMQ.mqType, taskMQ.options);
        // 指定接受队列
        this.resultQueue = taskMQ.resultQueue;

        // 工作计划
        this.jobSchedule = jobSchedule.regainGatherResult;
        this.batchRegainCount = batchRegainCount;
    }

    // 启动
    async start(options = {}) {

        try {

            // 初始化运行者
            await this.init(options);

            // 启动消息队列的连接
            await this.taskMQ.connect();

            // 构建定时作业
            const job = new RegainGatherResultJob({ taskMQ: this.taskMQ, resultQueue: this.resultQueue })

            // 启动定时作业 - 每分钟的第0秒启动
            this.schedule = schedule.scheduleJob(this.jobSchedule, async () => {
                this.schedule.cancel();
                try {
                    await job.do({ batchRegainCount: this.batchRegainCount });
                }
                catch (error) {
                    this.error('RegainGatherResultRunner工作异常', error);
                }

                // 重新启动定时计划
                this.schedule.reschedule(this.jobSchedule);
            })

            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        }
        catch (error) {
            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
            // 
            this.error('RegainGatherResultRunner工作异常', error);
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

module.exports = new RegainGatherResultRunner();