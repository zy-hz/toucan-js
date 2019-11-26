//
// 显示信息
//
module.exports = async (ctx, next) => {
    await next();

    // 返回结果
    ctx.result = ctx.clientIp;
}
