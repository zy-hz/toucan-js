//
// 采集任务批次详情表（每个具体的任务）
//

const BaseTable = require('./_base-table');

module.exports = class extends BaseTable {

    constructor(dbv, tbConst) {
        super(dbv, tbConst);
    }

    getLikeTableName(batchId) {
        return `${this.TABLENAME}_${batchId}`;
    }

} 