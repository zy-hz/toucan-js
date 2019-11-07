//
// 注册站点的模块
//

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从请求对象中获得参数
    const { machineInfo } = ctx.request.body;

    // 返回结果 - ctx.result
    ctx.result = { srv: machineInfo };
}
