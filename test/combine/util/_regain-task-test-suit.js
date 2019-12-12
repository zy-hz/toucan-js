/* eslint-disable no-undef */
// 回收任务测试
const runner = require('../../../libs/toucan-control-center/gather-task-center/runners/regain-gather-result');
const { DbVisitor, sleep } = require('../../../libs/toucan-utility');

const expect = require('chai').expect;
const _ = require('lodash');

function regainTaskTest(suitInfo,
    // 测试的参数
    { connDbCenter, mq, connResultCenter, batchOptions = {}, resultQueue, stationInfo },
    // 指定异常处理的方法
    {
        expectPlanTable,
        expectDetailTable
    }
) {
    const { suitName } = suitInfo;

    // 构建采集消息队列
    const taskMQ = Object.assign({}, mq, { resultQueue: _.castArray(resultQueue) });

    // 当前的时间
    const dtNow = new Date();
    describe(`[${suitName}] - 从结果消息队列回收任务`, function () {
        // 验证数据库使用的数据访问器
        const dbv = new DbVisitor(connDbCenter);
        // 任务数据中心
        const dbc = require('../../../libs/toucan-control-center/db-center')(connDbCenter);
        const dbConst = require('../../../libs/toucan-control-center/db-center/const.js');

        // 结果数据库
        const resultDb = new DbVisitor(connResultCenter);
        const resultTableName = _.isEmpty(batchOptions) ? resultQueue.storeOptions.tableName : batchOptions.storeTableName;

        before('准备测试环境', async () => {
            await resultDb.dropTables(resultTableName);
            await runner.init({ taskMQ });
        })

        let tasks;
        it('regain 测试', async () => {
            await sleep(1000);
            tasks = await runner.regainResult(5);
        })

        it('updateTasks 测试', async () => {
            // 更新任务到数据库
            await runner.updateTasks(tasks, connDbCenter);
        })

        it('batch_plan表验证', function (done) {
            const { batchId } = tasks[0];
            dbv.DB(dbConst.taskBatchPlan.TABLENAME).where(`${dbConst.taskBatchPlan.BATCHID}`, batchId).then(result => {
                expect(result).have.lengthOf(1);

                const row = result[0];

                expect(row[`${dbConst.taskBatchPlan.RUNCOUNT}`], 'RUNCOUNT').eq(1);
                expect(row[`${dbConst.taskBatchPlan.TASKERRORRATE}`], 'TASKERRORRATE').eq(0.00);

                if (_.isFunction(expectPlanTable)) {
                    expectPlanTable(row);
                } else {
                    expect(row[`${dbConst.taskBatchPlan.TASKDONECOUNT}`], 'TASKDONECOUNT').eq(1);
                    expect(row[`${dbConst.taskBatchPlan.TASKDONERATE}`], 'TASKDONERATE').eq(100.00)
                    expect(row[`${dbConst.taskBatchPlan.TASKRESIDUALCOUNT}`], 'TASKRESIDUALCOUNT').eq(0);
                    expect(row[`${dbConst.taskBatchPlan.ISEND}`], 'ISEND').eq(1);
                    expect(row[`${dbConst.taskBatchPlan.ENDON}`], 'ENDON').above(dtNow);
                    expect(row[`${dbConst.taskBatchPlan.SPENDTIME}`], 'SPENDTIME').above(1);
                }

                done();
            });
        })

        it('batch_detail表验证', function (done) {
            const { batchId, taskId } = tasks[0];
            const tableName = dbc.taskBatchDetail.getLikeTableName(batchId);
            dbv.DB(tableName).select().where('taskId', taskId).then(result => {

                const row = result[0];
                expect(row[`${dbConst.taskBatchDetail.BATCHID}`], 'BATCHID').eq(batchId);
                expect(row[`${dbConst.taskBatchDetail.TASKID}`], 'TASKID').eq(taskId);
                expect(row[`${dbConst.taskBatchDetail.TASKSTATE}`], 'TASKSTATE').eq(20);
                expect(row[`${dbConst.taskBatchDetail.RUNCOUNT}`], 'RUNCOUNT').eq(1);
                expect(row[`${dbConst.taskBatchDetail.DONECOUNT}`], 'DONECOUNT').eq(1);
                expect(row[`${dbConst.taskBatchDetail.ENDON}`], 'ENDON').above(dtNow);

                expect(row[`${dbConst.taskBatchDetail.STATIONNAME}`], 'STATIONNAME').eq(stationInfo.stationName);
                expect(row[`${dbConst.taskBatchDetail.STATIONNO}`], 'STATIONNO').eq(stationInfo.stationNo);
                expect(row[`${dbConst.taskBatchDetail.STATIONIP}`], 'STATIONIP').eq(stationInfo.stationIp);

                const task = tasks[0];
                const workTime = Math.ceil(task.taskSpendTime / 1000);
                expect(row[`${dbConst.taskBatchDetail.PROCESSTIME}`], 'PROCESSTIME').above(workTime);
                expect(row[`${dbConst.taskBatchDetail.WORKTIME}`], 'WORKTIME').eq(workTime);

                if (_.isFunction(expectDetailTable)) expectDetailTable(result);

                done();
            });

        })

        it('验证结果存储', function (done) {
            resultDb.DB(resultTableName).select().then(result => {
                expect(result, '结果数量').lengthOf(1);
                done()
            })
        })

        after('清理测试环境', async () => {
            await runner.stop();
            await dbv.close();
            await resultDb.close();
        })

    })
}

module.exports = { regainTaskTest }