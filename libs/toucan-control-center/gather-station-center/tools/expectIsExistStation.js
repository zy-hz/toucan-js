//
// 验证站点
//
const _ = require('lodash');
const { HOSTNAME, STATIONMD5, STATIONKEY } = require('../../db-center')().station.const;

module.exports = (existStation, hostname, machineMD5, machineKey) => {

    if (_.isNil(existStation)) throw new Error(`主机[${hostname}]还未创建`);
    if (existStation[`${HOSTNAME}`] != hostname) throw new Error(`主机[${hostname}]名称不匹配`);
    if (_.isArray(existStation)) throw new Error(`主机[${hostname}]有重复`);
    if (_.isEmpty(existStation[`${STATIONMD5}`]) || _.isEmpty(existStation[`${STATIONKEY}`])) throw new Error(`主机[${hostname}]未注册`);
    if (existStation[`${STATIONMD5}`] != machineMD5) throw new Error(`主机[${hostname}]有变更，需要重新注册`);
    if (existStation[`${STATIONKEY}`] != machineKey) throw new Error(`主机[${hostname}]登记的key不匹配`);

}