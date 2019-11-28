const _ = require('lodash');
const { currentDateTimeString } = require('../../toucan-utility');

//
// 响应处理模块(全局错误处理)
//
module.exports = async function (ctx, next) {
    try {
        // 调用下一个 middleware
        await next()

        // 处理响应结果
        if (!_.isNil(ctx.result)) {
            ctx.body = Object.assign(ctx.body || {}, {
                code: 0,
                result: ctx.result,
            })
        }

        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应
        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : 0,
            data: ctx.state.data !== undefined ? ctx.state.data : {}
        }
    } catch (e) {
        // catch 住全局的错误信息
        console.error(currentDateTimeString(), e.message);

        // 设置状态码为 200 - 服务端错误
        ctx.status = 200;

        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}
