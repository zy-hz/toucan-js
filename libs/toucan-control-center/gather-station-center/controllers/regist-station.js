//
// 注册站点的模块
//

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从查询中获得参数
    const { hostName, stationId } = ctx.query;

    // 返回结果
    ctx.result = Object.assign(ctx.result || {},
        {
            hostName,
            stationId
        }
    )
}
