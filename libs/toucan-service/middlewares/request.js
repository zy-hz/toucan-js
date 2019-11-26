const _ = require('lodash');

//
// 请求处理模块
//
module.exports = async function (ctx, next) {

    const req = ctx.request;
    ctx.clientIp = req.headers['x-forwarded-for']
        // 判断是否有反向代理 IP
        || req.headers['x-real-ip'];

    // 把ipv6格式转为ipv4
    ctx.clientIp = _.toString(_.words(ctx.ip, /\d+\.\d+\.\d+\.\d+/));
    
    // 调用下一个 middleware
    await next();

}
