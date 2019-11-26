//
// 数据中心
//

const dbConst = require('./const');
const StationTable = require('./_table-station');
const StationConfigTable = require('./_table-station-config');
const TaskBatchTable = require('./_table-task-batch');
const TaskBatchDetailTable = require('./_table-task-batch-detail');
const TaskBatchPlanTable = require('./_table-task-batch-plan');

const _ = require('lodash');

// 数据中心的类
class DbCenter {

    constructor(options) {

        const knex = require('knex')({
            client: options.client || 'mysql',
            connection: options
        });

        this.station = new StationTable(knex, dbConst.station);
        this.stationConfig = new StationConfigTable(knex, dbConst.stationConfig);
        this.taskBatch = new TaskBatchTable(knex, dbConst.taskBatch);
        this.taskBatchDetail = new TaskBatchDetailTable(knex, dbConst.taskBatchDetail);
        this.taskBatchPlan = new TaskBatchPlanTable(knex, dbConst.taskBatchPlan);

    }

    async destroy() {
        await this.station.destroy();
        await this.stationConfig.destroy();
        await this.taskBatch.destroy();
        await this.taskBatchDetail.destroy();
        await this.taskBatchPlan.destroy();
    }

    // 创建新表
    newTable(tableName, fromTable) {
        const table = _.cloneDeep(fromTable);
        table.TABLENAME = tableName;
        return table;
    }
}

// 更加选项创建数据中心
function createDbCenter(options) {
    return new DbCenter(options)
}

module.exports = createDbCenter;