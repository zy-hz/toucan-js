//
// 自动运行- 定时发布采集任务
//
const _ = require('lodash');

const { ToucanRunner } = require('../../../toucan-service');
const { spiderFactory } = require('../../../toucan-spider');
const mqFactory = require('../../../toucan-message-queue');
const { currentDateTimeString, cronNextTime } = require('../../../toucan-utility');
const { buildTaskBody } = require('../../../toucan-task/task-builder');

class PublishGatherTaskRunner extends ToucanRunner {

    constructor() {
        super();
        // 修改默认的工作计划
        // 每分钟的第0秒开始工作
        this.defaultscheduleRule = '*/5 * * * * *';
    }

    // 初始化
    async init(options = {}) {
        // 获得参数
        const { taskMQ, jobSchedule = {} } = options;

        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ(taskMQ.mqType, taskMQ.options);
        // 指定交换机
        this.exchange = taskMQ.exchangeName;
        // 准备exchange
        await this.taskMQ.mqVisitor.prepareExchange(this.exchange, 'direct', { durable: true });

        // 启动消息队列的连接
        await this.taskMQ.connect();

        // 工作计划 - 返回新options对象
        return _.assignIn({}, options, { scheduleRule: jobSchedule.publishGatherTask || this.defaultscheduleRule });
    }

    // 发布批次任务
    async publishBatchTasks(batchTasks, options = {}) {

        // 处理每个批次中的任务，添加任务选项
        const tasks = _.map(batchTasks, task => {
            const { batchId, taskId, taskBody, runCount } = task;
            // 注意：runCount 需要增加1，表示自己的运行次数
            const taskBodyObject = buildTaskBody(taskBody, Object.assign({}, { batchId, taskId, runCount: runCount + 1 }, options));
            const routeKey = spiderFactory.getSpiderId(taskBodyObject);
            return _.assign({}, { taskBody: taskBodyObject }, { taskOptions: { exchange: this.exchange, routeKey } });
        });

        // 推送采集任务到采集任务消息队列
        const publishResult = await this.taskMQ.publishTask(_.cloneDeep(tasks));
        if (publishResult.hasException) {
            // 发布任务发生异常
            this.error(`发布采集任务发生异常`, publishResult.error);
        }

        return publishResult;
    }

    async publishBatches(dbc, batchPublishCount, nowString) {
        const { taskBatchDetail, taskBatchPlan } = dbc;

        // 获得需要执行的批次 , 条件：当前时间已经超过计划的下次执行时间
        const batches = await taskBatchPlan.select(`${taskBatchPlan.NEXTQUEUEON}`, '<', `${nowString}`);

        let publishTaskCount = 0;
        for await (const batch of batches) {
            const { batchId, runCount, taskQueueCount, batchOptions } = batch;

            // 从数据中心获得需要发布的批次
            const tbName = taskBatchDetail.getLikeTableName(batchId);
            const tbv = dbc.newTable(tbName, taskBatchDetail);
            // 0-ready,1-reset,10-queue,20-done,21-error
            // < 10 表示读取ready和reset 类型的记录
            const batchTasks = await tbv.selectLimit(batchPublishCount, `${taskBatchDetail.TASKSTATE}`, '<', 10);

            // 发布到消息队列
            const result = await this.publishBatchTasks(batchTasks, _.isEmpty(batchOptions) ? {} : JSON.parse(batchOptions));
            if (!result.hasException) {
                // 发布成功后，更新任务详情表
                const updateRows = _.map(batchTasks, x => {
                    x.taskState = 10; // is queued
                    x.runCount = x.runCount + 1; // 运行次数加1
                    x.beginOn = currentDateTimeString();
                    return x;
                })
                await tbv.replace(updateRows);

                // 发布任务的数量
                publishTaskCount = publishTaskCount + result.taskCount;
            }

            // 重新计算下次运行时间
            const nextQueueOn = cronNextTime(batch.runPlan);
            // 计算计划开始时间，如果已经有开始时间，就放弃更改
            const beginOn = batch.beginOn > new Date('2001-01-01') ? undefined : nowString;
            // 更新计划表
            await taskBatchPlan.update(
                {
                    nextQueueOn, lastQueueOn: nowString, beginOn,
                    taskQueueCount: result ? taskQueueCount + batchTasks.length : taskQueueCount
                },
                { batchId, runCount }
            );
        }

        return publishTaskCount;
    }

    // 工作计划
    async scheduleWork(options = {}) {

        // 批量发布任务的数量
        const { dbConnection, batchPublishCount = 5 } = options;

        // 创建数据中心
        const dbc = require('../../db-center')(dbConnection);

        try {
            const nowString = currentDateTimeString();
            const publishTaskCount = await this.publishBatches(dbc, batchPublishCount, nowString);
            this.log(`发布${publishTaskCount}个采集任务`);
        }
        finally {
            await dbc.destroy();
        }

    }

    // 停止
    async stop() {
        // 关闭工作计划
        await super.stop();
        // 关闭消息队列
        await this.taskMQ.disconnect();
    }
}

module.exports = new PublishGatherTaskRunner();