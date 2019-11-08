/* eslint-disable require-atomic-updates */
//
// 注册站点的模块
//

const _ = require('lodash');
const { getObjectMD5 } = require('../../../toucan-utility');
const dbc = require('../../db-center')().station;
const { HOSTNAME } = dbc.const;

// 作为一个新机器注册
async function registAsNew({ machineInfo = {}, machineMD5, listenPort, listenIp }) {

    const { hostname } = machineInfo;

    // 根据主机名，检查这台主机是否注册过
    // 如果注册过,抛出异常
    if (await dbc.isRegisted(hostname)) throw new Error(`主机[${hostname}]已经被注册`);

    // 注册站点
    const stationInfo = await dbc.regist(Object.assign(machineInfo, { machineMD5, listenPort, listenIp }));
    return stationInfo;
}

// 更新注册信息
async function updateRegistInfo({ machineInfo = {}, machineMD5, listenPort, listenIp }, machineKey) {

    const { hostname } = machineInfo;

    const existStation = await dbc.select(`${HOSTNAME}`, hostname);
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

