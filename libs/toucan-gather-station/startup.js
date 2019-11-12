//
// 采集站点的启动控制器
//
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// 支持 minimist 启动参数
// --conf <配置文件，不带.json>
// --remote <远程控制服务器>
module.exports = async (args) => {

    if (!_.isEmpty(args.conf)) {
        // 从配置文件启动
        await startFromConfig(args.conf);
    }
    else if (!_.isEmpty(args.remote)) {
        // 从远程控制服务器启动
        await startFromRemote(args);
    }
    else {
        console.error(`没有指定启动方式。请使用以下几种启动参数：
        --conf <配置文件，不带.json> 
        --remote <远程控制服务器> --port <采集站的对外监听端口>`);
    }
}

async function startFromConfig(cfg) {
    const ToucanGatherStation = require('./index.js');
    const configFileName = path.join(process.cwd(), '../config', `${cfg}.json`);
    if (!fs.existsSync(configFileName)) {
        console.error(`配置文件不存在，采集站点使用默认配置启动。${configFileName}`);
    }
    const gs = new ToucanGatherStation(configFileName);

    // 初始化后，采集站自动启动
    await gs.init();
}

// 从远程站点启动
// 在该模式下，采集站点类似一个服务，运行远程服务器控制自己的行为
async function startFromRemote(args) {
    const StationListener = require('./service');
    const service = new StationListener();
    await service.start(args);
}
