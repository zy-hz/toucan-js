/* eslint-disable no-undef */
// 上传任务的测试套件
const runner = require('../../../libs/toucan-control-center/gather-task-center/runners/load-gather-task');
const _ = require('lodash');
const path = require('path');
const expect = require('chai').expect;
const { DbVisitor, sleep } = require('../../../libs/toucan-utility');

// 运行导入任务测试
function uploadTaskTest(suitInfo, { dbConnection } = {}, { expectDBTaskBody } = {}) {

    const { suitName, suitId, suitRoot } = suitInfo;
    const taskFile = path.resolve(suitRoot, `${suitId}.json`);
    const contentFile = path.resolve(suitRoot, `${suitId}.txt`);
    const { batchInfo } = require(taskFile);
    const task = {
        sourceName: suitName,
        batchInfo,
        contentFile
    }
    // 定义当前的时间
    const dtNow = new Date();

    describe(`[${suitName}] - 从目录载入采集任务`, function () {
        // 验证数据库使用的数据访问器
        const dbv = new DbVisitor(dbConnection);
        // 任务数据中心
        const dbc = require('../../../libs/toucan-control-center/db-center')(dbConnection);
        const dbConst = require('../../../libs/toucan-control-center/db-center/const.js');

        it('uploadTask 测试', async () => {
            // 延迟时间，用户和dtNow产生对比
            await sleep(1000);
            const result = await runner.uploadTask(task, dbc);
            expect(result).is.true;
        })

        // 获得批次
        let batchId;
        it('batch表验证', async () => {
            const result = await dbv.DB(dbConst.taskBatch.TABLENAME).select();
            expect(result).have.lengthOf(1);

            const row = result[0];
            expect(row[`${dbConst.taskBatch.BATCHNAME}`], 'BATCHNAME').eq(batchInfo.batchName);
            expect(row[`${dbConst.taskBatch.TASKCOUNT}`], 'TASKCOUNT').eq(1);
            expect(row[`${dbConst.taskBatch.RUNCOUNT}`], 'RUNCOUNT').eq(1);
            expect(row[`${dbConst.taskBatch.CREATEON}`], 'CREATEON').above(dtNow);

            batchId = row[`${dbConst.taskBatch.BATCHID}`];
            expect(row[`${dbConst.taskBatch.HOMEID}`], 'HOMEID').eq(batchId);
        })

        it('batch_plan表验证', async () => {
            const result = await dbv.DB(dbConst.taskBatchPlan.TABLENAME).where(`${dbConst.taskBatchPlan.BATCHID}`, batchId);
            expect(result).have.lengthOf(1);

            const row = result[0];
            expect(row[`${dbConst.taskBatchPlan.RUNCOUNT}`], 'RUNCOUNT').eq(1);
            expect(row[`${dbConst.taskBatchPlan.TASKRESIDUALCOUNT}`], 'TASKRESIDUALCOUNT').eq(1);
            expect(row[`${dbConst.taskBatchPlan.CREATEON}`], 'CREATEON').above(dtNow);
            expect(row[`${dbConst.taskBatchPlan.NEXTQUEUEON}`], 'NEXTQUEUEON').above(dtNow);
            expect(row[`${dbConst.taskBatchPlan.HOMEID}`], 'HOMEID').eq(batchId);
        })

        it('batch_detail表验证', async () => {
            const tableName = dbc.taskBatchDetail.getLikeTableName(batchId);
            const result = await dbv.DB(tableName).select();
            expect(result).have.lengthOf(1);

            const row = result[0];
            expect(row[`${dbConst.taskBatchDetail.BATCHID}`], 'BATCHID').eq(batchId);
            expect(row[`${dbConst.taskBatchDetail.TASKID}`], 'TASKID').eq(1);
            expect(row[`${dbConst.taskBatchDetail.TASKSTATE}`], 'TASKSTATE').eq(0);

            // 验证任务体
            const taskBody = row[`${dbConst.taskBatchDetail.TASKBODY}`];
            if (_.isFunction(expectDBTaskBody)) expectDBTaskBody(JSON.parse(taskBody));
        })

        after('', async () => {
            await dbc.destroy();
            await dbv.close();
        })
    })
}

module.exports = { uploadTaskTest }