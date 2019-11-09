/* eslint-disable require-atomic-updates */
//
// 注册站点的模块
//

const _ = require('lodash');
const { getObjectMD5 } = require('../../../toucan-utility');
const dbConfig = require('../config').dbConnection;
const dbc = require('../../db-center')(dbConfig).station;
const { HOSTNAME, STATIONKEY } = dbc;
const tools = require('../tools');

// 作为一个新机器注册
async function registAsNew({ machineInfo = {}, machineMD5, listenPort, listenIp }) {

    const { hostname } = machineInfo;
    const existStation = await dbc.selectOne(HOSTNAME, hostname);

    // 根据主机名，检查这台主机是否注册过,如果注册过,抛出异常
    tools.expectIsNewStation(existStation, hostname);

    // 生成machineKey
    const machineKey = tools.generateKey(machineInfo);

    // 更新站点
    await dbc.update(Object.assign(machineInfo, { machineMD5, listenPort, listenIp, machineKey }), `${HOSTNAME}`, hostname);

    // 查询该站点信息
    const stationInfo = await dbc.selectOne(HOSTNAME, hostname);
    return stationInfo;
}

// 更新注册信息
async function updateRegistInfo({ machineInfo = {}, machineMD5, listenPort, listenIp }, machineKey) {

    const { hostname } = machineInfo;
    const existStation = await dbc.selectOne(HOSTNAME, hostname);

    // 验证主机，没有通过，抛出异常
    tools.expectIsExistStation(existStation, hostname, machineMD5, machineKey);

    // 验证通过
    // 重新生成machineKey
    machineKey = tools.generateKey(machineInfo);
    // 更新站点
    await dbc.update({ listenPort, listenIp, machineKey }, HOSTNAME, hostname);

    const result = {};
    result[`${STATIONKEY}`] = machineKey;

    return result;
}

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从请求对象中获得参数
    const { machineInfo, machineKey = '', listenPort } = ctx.request.body;

    // 构建注册的参数
    const pms = { machineInfo, machineMD5: getObjectMD5(machineInfo), listenPort, listenIp: ctx.clientIp };

    // 返回结果
    ctx.result = _.isEmpty(machineKey) ? await registAsNew(pms) : await updateRegistInfo(pms, machineKey);
}

