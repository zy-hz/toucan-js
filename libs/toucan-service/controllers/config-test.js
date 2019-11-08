//
// 读取配置
//
const conf = require('../config');

module.exports = async (ctx, next) => {
    await next();

    // 返回结果
    ctx.result = conf;
}
