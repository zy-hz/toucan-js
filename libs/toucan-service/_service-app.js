//
// 各类服务的基类
//

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { mapDirToModule, StatusCode, getObjectClassName } = require('../toucan-utility');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const response = require('./middlewares/response');
const request = require('./middlewares/request');

const _ = require('lodash');
const fs = require('fs');
const path = require('path');


class ServiceApp extends ToucanWorkUnit {

    constructor(options = {}) {
        const { serviceName = 'ToucanService' } = options;
        super(Object.assign(
            {
                unitInfo: {
                    // 单元名称
                    unitName: serviceName,
                }
            },
            options)
        );

        // 设置应用的相关路径
        this.appPath = this.setAppPath(__dirname);
    }

    ////////////////////////////////////////////////
    //
    // 属性
    //
    get serviceName() { return this.unitInfo.unitName; }

    ////////////////////////////////////////////////
    //
    // 方法
    //    

    // options = { dbConnection }
    async start(options = {}) {

        // 已经启动
        if (!_.isNil(this._server)) return;

        try {
            // 把启动的配置附加到服务的配置上（提供全局使用）
            // 服务的配置

            const serviceConfig = fs.existsSync(this.appPath.configFile) ? require(this.appPath.configFile) : {};
            _.assignIn(serviceConfig, options);

            // 启动自动运行者
            this.startRunner(options);

            // 启动对外服务
            this.startApp(options);
        }
        catch (error) {
            this.error(`${this.serviceName}启动异常`, error);
        }
    }

    // 启动自动运行者
    startRunner(options = {}) {
        if (!fs.existsSync(this.appPath.runnerPath)) return;

        // 载入运行器
        this._runners = mapDirToModule(this.appPath.runnerPath);
        if (_.isNil(this._runners)) return;

        // 启动每个运行器
        _.each(this._runners, x => {
            this.log(`准备启动运行器->${getObjectClassName(x)}...`);
            x.start(options);
        });
    }

    // 启动服务
    startApp(options = {}) {
        // 监听的端口号
        const { port = 3000 } = options;
        const app = new Koa();
        // 使用响应处理中间件（全局错误处理）
        app.use(response);

        // 解析请求体
        app.use(bodyParser());

        // 引入路由分发
        const router = this.createRouter(options);
        app.use(router.routes());

        // 使用处理请求中间件
        app.use(request);

        this._server = app.listen(port);
        this.log(`在端口${port}上启动服务`);
    }

    // 停止服务
    stop() {
        // 第一优先停止外部服务
        this.stopApp();
        this.stopRunner();

        // 更新工作状态
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }

    stopApp() {
        if (!_.isNil(this._server)) {
            this._server.close();
            delete this._server;

            this.log('服务停止');
        }
    }

    stopRunner() {
        if (_.isNil(this._runners)) return;

        // 停止每个运行器
        _.each(this._runners, x => {
            this.log(`正在停止运行器->${getObjectClassName(x)}...`);
            x.stop();
        });

        delete this._runners;
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

    // 设置应用的路径
    setAppPath(d) {

        const appPath = {};
        appPath.servicePath = d;
        appPath.controllerPath = path.resolve(d, 'controllers');
        appPath.runnerPath = path.resolve(d, 'runners');
        appPath.initScriptPath = path.resolve(d, 'scripts/init');
        appPath.configFile = path.resolve(d, 'config.js');

        appPath.cachePath = path.resolve(process.cwd(), '.cache');
        return appPath;
    }

    // 创建路由
    createRouter(options = {}) {
        // 应用的根目录
        const { appRoot = '' } = options;

        const router = require('koa-router')({
            prefix: appRoot
        });

        // 载入控制器
        const controllers = mapDirToModule(this.appPath.controllerPath);

        // 枚举每个方法
        _.forEach(controllers, (val, key) => {

            // 转为router - 支持 get 和 post
            router.get(`/${key}`, val);
            router.post(`/${key}`, val);
        })

        return router;
    }

}

module.exports = ServiceApp;