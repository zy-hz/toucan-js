//
// 同步站点的配置
//
const _ = require('lodash');
const dbConfig = require('../config').dbConnection;
const { getObjectMD5 } = require('../../../toucan-utility');
const { HOSTNAME, STATIONCONFIGPLANID } = require('../../db-center/const').station;
const tools = require('../tools');

// 获得指定站点的配置方案
async function getStatioinConfigPlanId(dbc, machineInfo, stationKey) {

    const { hostname } = machineInfo;
    const machineMD5 = getObjectMD5(machineInfo);
    const existStation = await dbc.station.selectOne(HOSTNAME, hostname);

    // 验证主机，没有通过，抛出异常
    tools.expectIsExistStation(existStation, hostname, machineMD5, stationKey);

    return existStation[`${STATIONCONFIGPLANID}`];
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
        const planId = await getStatioinConfigPlanId(dbc, machineInfo, stationKey);
    }
    finally {
        await dbc.destroy();
    }

}