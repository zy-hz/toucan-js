/* eslint-disable require-atomic-updates */
//
// 注册站点的模块
//

const _ = require('lodash');
const { getObjectMD5 } = require('../../../toucan-utility');

// 作为一个新机器注册
async function registAsNew(machineInfo) {

}

// 更新注册信息
async function updateRegistInfo(machineInfo, machineKey) {

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

