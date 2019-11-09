//
// 站点表
// 

const BaseTable = require('./_base-table');
const _ = require('lodash');

module.exports = class extends BaseTable {

    constructor(dbv, tbConst) {
        super(dbv, tbConst);
    }

    objMap2Field(obj) {
        return Object.assign(
            // 提取标准字段
            this.objMap2Field_standard(obj),
            // 提取机器相关字段
            this.objMap2Field_machineInfo(obj)
        );
    }

    objMap2Field_standard(obj) {
        const fields = {};

        _.forEach(this.tableConst, (val) => {
            if (obj[`${val}`]) fields[`${val}`] = obj[`${val}`];
        })

        return fields;
    }

    objMap2Field_machineInfo(obj) {
        const fields = {};

        if (obj.hostname) fields[`${this.HOSTNAME}`] = obj.hostname;
        if (obj.machineMD5) fields[`${this.STATIONMD5}`] = obj.machineMD5;
        if (obj.machineKey) fields[`${this.STATIONKEY}`] = obj.machineKey;

        if (obj.listenIp) fields[`${this.STATIONIP}`] = obj.listenIp;
        if (obj.listenPort) fields[`${this.STATIONLISTENPORT}`] = obj.listenPort;
     
        return fields;
    }
} 