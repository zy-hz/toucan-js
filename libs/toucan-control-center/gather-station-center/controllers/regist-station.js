//
// 注册站点的模块
//

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从查询中获得参数
    const { hostName, userKey } = ctx.query;

    const stationId = '系统分配给这个主机的stationId';
    // 其他地方操作，都是使用该令牌
    const token = '工作的令牌';

    // 返回结果
    ctx.result = Object.assign(ctx.result || {},
        {
            hostName,
            stationId,
            token,
        }
    )
}
