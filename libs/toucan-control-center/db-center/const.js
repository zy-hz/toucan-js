//
// 数据中心的常量集合
//

const stationTableConst = require('./_table-station-const');
const stationConfigTableConst = require('./_table-station-config-const');
const taskBatchConst = require('./_table-task-batch-const');
const taskBatchDetailConst = require('./_table-task-batch-detail-const');
const taskBatchPlanConst = require('./_table-task-batch-plan-const');

module.exports = {
    station: stationTableConst,
    stationConfig: stationConfigTableConst,
    taskBatch: taskBatchConst,
    taskBatchDetail: taskBatchDetailConst,
    taskBatchPlan: taskBatchPlanConst,
}