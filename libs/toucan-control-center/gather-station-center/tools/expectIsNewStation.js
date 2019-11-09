//
// 是否注册
//
const _ = require('lodash');
const { HOSTNAME, STATIONMD5, STATIONKEY } = require('../../db-center/const').station;

module.exports = (existStation,hostname)=>{

    if (_.isNil(existStation)) throw new Error(`主机[${hostname}]还未创建`);
    if (existStation[`${HOSTNAME}`] != hostname) throw new Error(`主机[${hostname}]名称不匹配`);
    if (_.isArray(existStation)) throw new Error(`主机[${hostname}]有重复`);

    if (!_.isEmpty(existStation[`${STATIONMD5}`]) || !_.isEmpty(existStation[`${STATIONKEY}`])) throw new Error(`主机[${hostname}]已注册`);

}