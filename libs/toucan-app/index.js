//
// 应用程序的基类
//
const path = require('path');
const { getConfigObject } = require('../toucan-utility');
const initDb = require('../toucan-service/_initdb');
const { ToucanLogger } = require('../toucan-work-unit');

// 启动参数影射表
const nameMap = {
    gsc: { name: 'gather-station-center', description: '采集站点控制中心', class: 'GatherStationCenter' },
    gtc: { name: 'gather-task-center', description: '采集任务控制中心', class: 'GatherTaskCenter' },
    grc: { name: 'gather-result-center', description: '采集结果控制中心' , class: 'GatherResultCenter'}
}

class ToucanApp extends ToucanLogger {

    // 初始化应用程序
    async init(args) {

        // 初始化第一个app
        if (args._.length > 0) await this.initApp(nameMap[`${args._[0]}`]);

        this.log('初始化完成');
    }

    // 初始化一个应用
    async  initApp(obj) {
        this.log(`初始化${obj.description}...`);

        // 应用的配置文件
        const configs = getConfigs(obj.name);
        // 从配置文件获得应用的配置
        const options = getConfigObject(configs);

        // 应用的初始化脚本目录
        const appPath = path.join(`${process.cwd()}`, '/libs/toucan-control-center', obj.name, 'scripts/init');
        // 初始化数据库
        await initDb(appPath, options, msg => this.log(msg));
    }

    // 启动应用程序
    async start(args) {

        // 启动第一个app
        // args可能有多个app，以后可以开发同时启动多个
        if (args._.length > 0) await this.startApp(nameMap[`${args._[0]}`]);
    }

    // 启动一个应用
    async startApp(obj) {
        this.log(`准备启动${obj.description}...`);

        // 应用的配置文件
        const configs = getConfigs(obj.name);
        // 从配置文件获得应用的配置
        const options = getConfigObject(configs);

        // 获得应用的类
        const appClass = require('../toucan-control-center')[`${obj.class}`];
        appClass.start(options);
    }
}

// 获得配置文件，越后越优先
function getConfigs(name) {

    const defaultConfigFile = path.join(`${process.cwd()}`, '/libs/toucan-control-center', name, 'config.js');
    const secondConfig = path.join(`${process.cwd()}`, '../config/', `${name}.config.json`);
    const firstConfig = path.join('/data/release/config/', `${name}.config.json`);

    return [defaultConfigFile, secondConfig, firstConfig]
}

module.exports = new ToucanApp();