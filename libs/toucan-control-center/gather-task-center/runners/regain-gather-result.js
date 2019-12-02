//
// 自动运行- 定时回收采集结果
//
const _ = require('lodash');

const { ToucanRunner } = require('../../../toucan-service');
const mqFactory = require('../../../toucan-message-queue');
const rsFactory = require('../../../toucan-result-store');
const { currentDateTimeString, getDateTimeDiff } = require('../../../toucan-utility');

class RegainGatherResultRunner extends ToucanRunner {

    constructor() {
        super();
        // 修改默认的工作计划
        // 每隔10秒工作一次
        this.defaultscheduleRule = '*/10 * * * * *';
    }

    async init(options = {}) {
        // 获得参数
        const { taskMQ, jobSchedule = {} } = options;

        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ(taskMQ.mqType, taskMQ.options);
        // 指定接受队列
        this.resultQueue = taskMQ.resultQueue;
        // 启动消息队列的连接
        await this.taskMQ.connect();

        // 工作计划 - 返回新options对象
        return _.assignIn({}, options, { scheduleRule: jobSchedule.regainGatherResult || this.defaultscheduleRule });
    }

    // 回收一个队列的采集结果
    async do4Queue(q, batchRegainCount, resultStore) {
        const { queue, options } = q;

        let jobCount = 0;
        let tasks = [];
        do {
            // 从消息队列订阅结果，这个阶段出现的异常，需要抛出
            // 测试的时候，可以将noAck设置为true,
            // 注意：waitAckNumber 参数没有生效（同时获取的任务数量）
            const msg = await this.taskMQ.subscribeResult(queue, { consumeOptions: options });
            if (msg === false) break;

            // 保存结果到指定目录
            await resultStore.save(msg)

            jobCount = jobCount + msg.length;
            tasks = _.concat(tasks, _.map(msg, m => {
                // 信息对象
                const { task, station = {}, page = {} } = m;
                // 获取页面的异常信息
                const { hasException = false, errno = 0, message = '' } = page;
                return Object.assign(task, { station }, { pageException: { hasException, errorNo: errno, errorMessage: message } })
            }));

        } while (jobCount < batchRegainCount)

        return tasks;
    }

    // 从队列中回收结果
    async regainResult(batchRegainCount) {
        let allTask = [];
        for await (const q of this.resultQueue) {
            // 创建结果存储器 - 可以为每个采集结果队列指定不同的结果存储器
            const resultStore = rsFactory.create(q);

            const tasks = await this.do4Queue(q, batchRegainCount, resultStore);
            this.log(`从${q.queue}回收${tasks.length}个采集结果。`);

            allTask = _.concat(allTask, tasks);
        }

        return allTask;
    }

    async updateTaskDetailTable(batches, dbc, nowString) {
        const { taskBatchDetail } = dbc;
        for await (const batchId of _.keys(batches)) {
            // 从数据中心获得需要发布的批次
            const tbName = taskBatchDetail.getLikeTableName(batchId);
            const tbv = dbc.newTable(tbName, taskBatchDetail);
            const tasks = batches[`${batchId}`];

            // 读取任务相关的row
            const taskIds = _.map(tasks, `${tbv.TASKID}`);
            const rows = await tbv.select(`${tbv.TASKID}`, 'in', [taskIds]);
            if (_.isEmpty(rows)) throw new Error(`在任务详情表[${tbName}]中没有发现下列任务：${taskIds.join(' ')}`);

            // 合并任务
            const outRows = _.zip(_.orderBy(rows, `${tbv.TASKID}`), _.orderBy(tasks, `${tbv.TASKID}`));

            // 更新详情表
            await tbv.replace(_.map(outRows, r => {
                const row = r[0];
                const task = r[1];
                const { station, pageException, taskSpendTime, spiderName, spiderType } = task;
                // 使用页面的异常作为任务的异常，也就是说，如果页面有异常，任务则为异常
                const taskState = pageException.hasException ? 21 : 20;
                const counter = {
                    doneCount: taskState === 20 ? row.doneCount + 1 : row.doneCount,
                    errorCount: taskState === 21 ? row.errorCount + 1 : row.errorCount
                }
                const { errorNo, errorMessage } = pageException;

                return _.merge({}, r[0], counter, station, {
                    taskState,
                    errorNo, errorMessage,
                    endOn: nowString,
                    processTime: getDateTimeDiff(nowString, row.beginOn, { abs: true }),
                    workTime: Math.ceil((taskSpendTime || 0) / 1000),
                    spiderName,
                    spiderType
                });
            }))
        }
    }

    async updateTaskPlanTable(batches, dbc, nowString) {
        const { taskBatchPlan } = dbc;
        batches = _.map(batches, (val, key) => {
            const batchId = key - 0;
            const runCount = _.max(_.map(val, `${taskBatchPlan.RUNCOUNT}`));
            const div = _.partition(val, x => { return x.pageException.hasException });
            const errorCount = div[0].length;
            const doneCount = div[1].length + div[0].length;
            return { batchId, runCount, doneCount, errorCount };
        })

        const values = _.map(batches, x => { return `(${x.batchId},${x.runCount})` });
        const where = `(${taskBatchPlan.BATCHID},${taskBatchPlan.RUNCOUNT}) in (${values.join(',')})`;
        const rows = await taskBatchPlan.select(where);
        const outRows = _.zip(_.orderBy(rows, `${taskBatchPlan.BATCHID}`), _.orderBy(batches, `${taskBatchPlan.BATCHID}`));

        // 更新任务计划表
        await taskBatchPlan.replace(_.map(outRows, r => {
            const row = r[0];
            const plan = r[1];
            const taskDoneCount = row.taskDoneCount + plan.doneCount;
            const taskErrorCount = row.taskErrorCount + plan.errorCount;
            let taskResidualCount = row.taskResidualCount - plan.doneCount;
            if (taskResidualCount < 0) taskResidualCount = 0;

            const taskDoneRate = (taskDoneCount / (taskDoneCount + taskResidualCount) * 100).toFixed(2) - 0;
            const taskErrorRate = (taskErrorCount / (taskDoneCount + taskResidualCount) * 100).toFixed(2) - 0;

            // 开始信息
            const beginOn = row.beginOn > new Date('2001-01-01') ? undefined : nowString;
            // 构建结束的信息
            const endInfo = Math.floor(taskDoneRate) === 100 ? {
                isEnd: true,
                endOn: nowString,
                spendTime: getDateTimeDiff(nowString, row.beginOn, { abs: true })
            } : {};
            return _.merge({}, row, endInfo, {
                beginOn,
                lastResultOn: nowString,
                taskDoneCount,
                taskErrorCount,
                taskResidualCount,
                taskDoneRate,
                taskErrorRate,
            });
        }))
    }

    // 更新任务到数据库
    async updateTasks(tasks, dbConnection) {
        // 如果是空数组，放弃处理
        if (_.isEmpty(tasks)) return;

        const batches = _.groupBy(tasks, 'batchId');

        // 创建数据中心
        const dbc = require('../../db-center')(dbConnection);

        // 当前时间的字符串
        const nowString = currentDateTimeString();

        try {
            // 更新任务详情表
            await this.updateTaskDetailTable(batches, dbc, nowString);

            // 更新任务计划表
            await this.updateTaskPlanTable(batches, dbc, nowString);
        }
        finally {
            await dbc.destroy();
        }
    }

    async scheduleWork(options = {}) {

        const { dbConnection, batchRegainCount = 5 } = options;

        // 回收结果
        const tasks = await this.regainResult(batchRegainCount);

        // 更新任务到数据库
        await this.updateTasks(tasks, dbConnection);
    }

    // 停止
    async stop() {
        // 关闭工作计划
        await super.stop();
        // 关闭消息队列
        await this.taskMQ.disconnect();
    }
}

module.exports = new RegainGatherResultRunner();