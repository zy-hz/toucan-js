//
// 采集任务批次详情表（每个具体的任务）
//

const BaseTable = require('./_base-table');
const { md5 } = require('../../toucan-utility');
const _ = require('lodash');

module.exports = class extends BaseTable {

    constructor(dbv, tbConst) {
        super(dbv, tbConst);
    }

    getLikeTableName(batchId) {
        return `${this.TABLENAME}_${batchId}`;
    }

    // 新建一个数据行
    newRow(batchId, taskBody, options = {}) {
        if (!_.isObject(taskBody)) taskBody = JSON.parse(taskBody);
        const urlMD5 = md5(taskBody.targetUrl);

        return Object.assign({ batchId, taskBody: JSON.stringify(taskBody), urlMD5 }, options);
    }
} 