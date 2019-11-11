//
// 同步站点的配置
//

module.exports = async (ctx, next) => {
    // 通知其他模块先运行，例如验证什么的
    await next();

    ctx.result = 'i am ok';
}