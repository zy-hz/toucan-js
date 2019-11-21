/* eslint-disable require-atomic-updates */
//
// 注册站点的模块
//

const _ = require('lodash');
const { HOSTNAME } = require('../../db-center/const').station;
const dbConfig = require('../config').dbConnection;
const tools = require('../tools');
const { currentDateTimeString } = require('../../../toucan-utility');

// 作为一个新机器注册
async function registAsNew(dbc, { machineInfo = {}, machineMD5, listenPort, listenIp }) {

    const { hostname } = machineInfo;
    const existStation = await dbc.selectOne(HOSTNAME, hostname);

    // 根据主机名，检查这台主机是否注册过,如果注册过,抛出异常
    tools.expectIsNewStation(existStation, hostname);

    // 生成stationKey
    const stationKey = tools.generateKey(machineInfo);

    // 注册的时间
    const registOn = currentDateTimeString();
    // 更新站点
    await dbc.update(Object.assign(machineInfo, { machineMD5, listenPort, listenIp, stationKey, registOn }), `${HOSTNAME}`, hostname);

    // 查询该站点信息
    const stationInfo = await dbc.selectOne(HOSTNAME, hostname);
    return stationInfo;
}

// 更新注册信息
async function updateRegistInfo(dbc, { machineInfo = {}, machineMD5, listenPort, listenIp }, stationKey) {

    const { hostname } = machineInfo;
    const existStation = await dbc.selectOne(HOSTNAME, hostname);

    // 验证主机，没有通过，抛出异常
    tools.expectIsExistStation(existStation, hostname, machineMD5, stationKey);

    // 验证通过
    // 重新生成stationKey
    stationKey = tools.generateKey(machineInfo);
    // 更新的时间
    const updateOn = currentDateTimeString();
    // 更新站点
    await dbc.update({ listenPort, listenIp, stationKey, updateOn }, HOSTNAME, hostname);

    return { stationKey };
}

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从请求对象中获得参数
    const { machineInfo, stationKey = '', listenPort } = ctx.request.body;

    // 构建注册的参数
    const pms = { machineInfo, machineMD5: tools.getMachineMD5(machineInfo), listenPort, listenIp: ctx.clientIp };

    // 创建数据中心
    const dbc = require('../../db-center')(dbConfig).station;
    try {

        // 返回结果
        ctx.result = _.isEmpty(stationKey) ? await registAsNew(dbc, pms) : await updateRegistInfo(dbc, pms, stationKey);
    }
    finally {
        await dbc.destroy();
    }

}

