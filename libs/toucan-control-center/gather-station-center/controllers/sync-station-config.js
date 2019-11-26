/* eslint-disable require-atomic-updates */
//
// 同步站点的配置
//
const _ = require('lodash');
const dbConfig = require('../config').dbConnection;
const { HOSTNAME, STATIONID, STATIONNAME, STATIONCONFIGPLANID } = require('../../db-center/const').station;
const { CONFIGID } = require('../../db-center/const').stationConfig;
const tools = require('../tools');

const DEFAULT_PLAN_ID = '_default-01';

// 获得指定站点
async function getStation(dbc, machineInfo, stationKey) {

    const { hostname } = machineInfo;
    const machineMD5 = tools.getMachineMD5(machineInfo);
    const existStation = await dbc.selectOne(HOSTNAME, hostname);

    // 验证主机，没有通过，抛出异常
    tools.expectIsExistStation(existStation, hostname, machineMD5, stationKey);

    return existStation;
}

async function getStationConfig(dbc, station) {
    const pid = station[`${STATIONCONFIGPLANID}`] || DEFAULT_PLAN_ID
    const row = await dbc.selectOne(CONFIGID, pid);
    if (_.isNil(row)) throw new Error(`没有发现配置方案。${pid}`);

    const plan = JSON.parse(row.configBody);
    return Object.assign(plan, { stationName: station[`${STATIONNAME}`], stationNo: station[`${STATIONID}`] })
}

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    const { machineInfo, stationKey = '' } = ctx.request.body;

    if (_.isNil(machineInfo)) throw Error('站点信息不能为 undefined');
    if (_.isEmpty(stationKey)) throw Error('站点令牌不能为空');

    // 创建数据中心
    const dbc = require('../../db-center')(dbConfig);
    try {
        // 获得配置方案
        const station = await getStation(dbc.station, machineInfo, stationKey);
        ctx.result = await getStationConfig(dbc.stationConfig, station);
    }
    finally {
        await dbc.destroy();
    }
}