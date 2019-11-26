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

    objMap2Field_machineInfo(obj) {
        const fields = {};

        if (obj.hostname) fields[`${this.HOSTNAME}`] = obj.hostname;
        if (obj.machineMD5) fields[`${this.STATIONMD5}`] = obj.machineMD5;
        if (obj.stationKey) fields[`${this.STATIONKEY}`] = obj.stationKey;

        if (obj.listenIp) fields[`${this.STATIONIP}`] = obj.listenIp;
        if (obj.listenPort) fields[`${this.STATIONLISTENPORT}`] = obj.listenPort;

        if (obj.arch) fields[`${this.SYSARCH}`] = obj.arch;
        if (obj.memory) fields[`${this.SYSMEMORY}`] = obj.memory;
        if (obj.platform) fields[`${this.SYSPLATFORM}`] = obj.platform;
        if (obj.release) fields[`${this.SYSRELEASE}`] = obj.release;
        if (obj.type) fields[`${this.SYSTYPE}`] = obj.type;
        
        if(obj.nodeVersion) fields[`${this.NODEVERSION}`] = obj.nodeVersion;
        if(obj.libVersion) fields[`${this.LIBVERSION}`] = obj.libVersion;
        return fields;
    }
} 