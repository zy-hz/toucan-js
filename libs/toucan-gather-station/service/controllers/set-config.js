//
// 设置配置
//
const cache = require('../cache');
const _ = require('lodash');

module.exports = async (ctx, next) => {
    // 通知其他模块先执行
    await next();

    // config - 配置的对象
    // serverKey - 服务器的身份信息
    const { config, severKey } = ctx.query;

    cache.isConfigChanged = !_.isEqual(cache.config,config);
    if(cache.isConfigChanged) cache.config = config;

    // 不需要任何返回结果
    ctx.result = {};
}

