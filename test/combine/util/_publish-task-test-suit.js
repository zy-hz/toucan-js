/* eslint-disable no-undef */
const runner = require('../../../libs/toucan-control-center/gather-task-center/runners/publish-gather-task');
const { getDateTimeString, DbVisitor, sleep } = require('../../../libs/toucan-utility');

const expect = require('chai').expect;
const _ = require('lodash');

function publishTaskTest(suitInfo,
    { dbConnection, mq, batchOptions = {} } = {},
    // 第几次运行
    runIndex,
    {
        expectMQTaskBody,
        expectDetailTable,
        expectPlanTable
    }) {
    const { suitName } = suitInfo;


    // 定义当前的时间
    const dtNow = new Date();
    // 因为刚加入表的记录 nextQueueOn = 当前的时间，所以需要假设当前时间为后1分钟，保证有数据取出
    const nowString = getDateTimeString(dtNow, { num: 10, unit: 'minutes' });
    // 消息队列访问器
    const mqv = require('../../../libs/toucan-mq-visitor')(mq.mqType, mq.options);

    describe(`[${suitName}] - 发布采集任务到消息服务器`, function () {
        // 验证数据库使用的数据访问器
        const dbv = new DbVisitor(dbConnection);
        // 任务数据中心
        const dbc = require('../../../libs/toucan-control-center/db-center')(dbConnection);
        const dbConst = require('../../../libs/toucan-control-center/db-center/const.js');

        before('测试前准备', async () => {
            await mqv.deleteExchange(mq.exchangeName);
            await mqv.deleteQueue(mq.queueName);
            await runner.init({ taskMQ: mq });

            console.log(`%c${_.repeat('*', 10)} 第${runIndex}次运行 ${_.repeat('*', 10)}`, 'color: green');
        })

        it('publish 测试', async () => {
            await sleep(1000);
            const result = await runner.publishBatches(dbc, 1, nowString);
            expect(result, '一共1个').to.be.eq(1);
        })

        let taskObj;
        it('read mq 测试', async () => {
            // 必须设置noAck = false,因为这个任务需要留给后续的测试使用
            const msg = await mqv.read({ queue: mq.queueName, consumeOptions: { noAck: false } });
            expect(_.isObject(msg)).is.true;

            taskObj = JSON.parse(msg.content.toString());
            expect(_.isObject(taskObj)).is.true;

            // 验证任务参数
            if (!_.isEmpty(batchOptions)) {
                expect(taskObj.resultQueueName, 'resultQueueName').eq(batchOptions.resultQueueName);
                expect(taskObj.storeTableName, 'storeTableName').eq(batchOptions.storeTableName);
            }

            // 验证消息队列的任务体
            if (_.isFunction(expectMQTaskBody)) expectMQTaskBody(taskObj);
        })

        it('batch_plan表验证', async () => {
            const { batchId } = taskObj;
            const result = await dbv.DB(dbConst.taskBatchPlan.TABLENAME).where(`${dbConst.taskBatchPlan.BATCHID}`, batchId);

            if (_.isFunction(expectPlanTable)) {
                expectPlanTable(result, runIndex)
            } else {
                expect(result).have.lengthOf(1);

                const row = result[0];
                expect(row[`${dbConst.taskBatchPlan.RUNCOUNT}`], 'RUNCOUNT').eq(1);
                expect(row[`${dbConst.taskBatchPlan.TASKRESIDUALCOUNT}`], 'TASKRESIDUALCOUNT').eq(1);
                expect(row[`${dbConst.taskBatchPlan.CREATEON}`], 'CREATEON').above(dtNow);
                expect(row[`${dbConst.taskBatchPlan.BEGINON}`], 'BEGINON').above(dtNow);
                expect(row[`${dbConst.taskBatchPlan.NEXTQUEUEON}`], 'NEXTQUEUEON').above(dtNow);
                expect(row[`${dbConst.taskBatchPlan.LASTQUEUEON}`], 'LASTQUEUEON').above(dtNow);
                expect(row[`${dbConst.taskBatchPlan.HOMEID}`], 'HOMEID').eq(batchId);
                expect(row[`${dbConst.taskBatchPlan.TASKQUEUECOUNT}`], 'TASKQUEUECOUNT').eq(1);
            }
        })

        it('batch_detail表验证', async () => {
            const { batchId } = taskObj;
            const tableName = dbc.taskBatchDetail.getLikeTableName(batchId);
            const result = await dbv.DB(tableName).select();

            if (_.isFunction(expectDetailTable)) {
                expectDetailTable(result, runIndex);
            } else {
                expect(result).have.lengthOf(1);

                const row = result[0];
                expect(row[`${dbConst.taskBatchDetail.BATCHID}`], 'BATCHID').eq(batchId);
                expect(row[`${dbConst.taskBatchDetail.TASKID}`], 'TASKID').eq(1);
                expect(row[`${dbConst.taskBatchDetail.TASKSTATE}`], 'TASKSTATE').eq(10);
                expect(row[`${dbConst.taskBatchDetail.RUNCOUNT}`], 'RUNCOUNT').eq(1);
                expect(row[`${dbConst.taskBatchDetail.BEGINON}`], 'BEGINON').above(dtNow);
            }
        })

        after('测试和清理', async () => {
            await runner.stop();
            await dbc.destroy();
            await dbv.close();
            await mqv.disconnect();
        })
    })
}

module.exports = { publishTaskTest }