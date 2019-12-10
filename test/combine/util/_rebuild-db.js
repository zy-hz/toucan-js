// 准备数据库环境
const { DbVisitor } = require('../../../libs/toucan-utility');
const path = require('path');

async function rebuildTaskDb(dbConnection) {
    const dbv = new DbVisitor(dbConnection);
    // 清除任务相关的表
    await dbv.dropTables('gt_batch', 'gt_batch_plan', 'gt_batch_u', 'gt_batch_u.');

    const sqlBatch = path.resolve(process.cwd(), 'libs/toucan-control-center/gather-task-center/scripts/init/0-create_gt_batch.sql');
    await dbv.execSql(sqlBatch);

    const sqlBatchPlan = path.resolve(process.cwd(), 'libs/toucan-control-center/gather-task-center/scripts/init/0-create_gt_batch_plan.sql');
    await dbv.execSql(sqlBatchPlan);

    const sqlBatchU = path.resolve(process.cwd(), 'libs/toucan-control-center/gather-task-center/scripts/init/0-create_gt_batch_u.sql');
    await dbv.execSql(sqlBatchU);

    await dbv.close();

}

async function rebuildResultDb(dbConnection, tableName) {
    const dbv = new DbVisitor(dbConnection);
    await dbv.dropTables(tableName);
    await dbv.close();
}

module.exports = { rebuildTaskDb, rebuildResultDb }