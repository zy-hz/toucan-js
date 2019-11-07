//
// 注册站点的模块
//

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    // 从查询中获得参数
    // config - 配置对象
    // serverKey - 服务器的身份信息
    const { config, serverKey } = ctx.query;


    // 返回结果 - ctx.result
    ctx.result = {srv:'我是中文'};
}
