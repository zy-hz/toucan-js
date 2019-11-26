//
// 采集任务批次表
//

const BaseTable = require('./_base-table');
const moment = require('moment');
const _ = require('lodash');


module.exports = class extends BaseTable {

    constructor(dbv, tbConst) {
        super(dbv, tbConst);
    }

    // 产生唯一批次编号
    async generateBatchId({
        // 插入表
        insertToTable = false } = {}
    ) {

        let batchId, existRow;
        do {
            batchId = this.buildBatchId();
            existRow = await this.selectOne({ batchId });
        } while (!_.isNil(existRow))

        if (insertToTable) await this.insert({ batchId });
        return batchId;
    }

    buildBatchId() {
        const s = Math.abs(moment().startOf('day').diff(moment(), 'seconds'));
        return moment().format('YYYYMMDD') + s;
    }

} 