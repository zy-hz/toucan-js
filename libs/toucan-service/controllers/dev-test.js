//
// 测试用的控制器
//
module.exports = async (ctx, next) => {
    await next();

    // 返回结果
    ctx.result = 'I am ready! 我准备好了';
}
