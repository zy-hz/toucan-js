//
// 各类服务的基类
//

const { ToucanWorkUnit } = require('../toucan-work-unit');
const Koa = require('koa');
const app = new Koa();
const _ = require('lodash');

class ToucanService extends ToucanWorkUnit {

    constructor(options = {}) {
        super(Object.assign(
            {
                unitInfo: {            
                    // 单元名称
                    unitName: 'ToucanService',
                }
            },
            options)
        );

    }

    start(options = {}) {
        // 已经启动
        if (!_.isNil(this._server)) return;

        app.use(async (ctx, next) => {
            await next();
            ctx.response.type = 'text/html';
            ctx.response.body = '<h1>Hello, koa2!</h1>';
        });

        this._server = app.listen(3000);
        this.log('服务启动');
    }

    stop() {
        if (!_.isNil(this._server)) {
            this._server.close();

            this.log('服务停止');
        }
    }

    ////////////////////////////////////////////////
    //
    // 以下是重载ToucanWorkUnit的方法
    //
    log(msg) {
        msg = `[${this.unitInfo.unitName}] ${msg}`;
        super.log(msg)
    }

    ////////////////////////////////////////////////
    //
    // 以下是可以被基类重载的方法
    //


}

module.exports = ToucanService;