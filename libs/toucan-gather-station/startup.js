//
// 采集站点的启动控制器
//
const path = require('path');
const fs = require('fs');
const ToucanGatherStation = require('./_gather-statioin-v1');

// 支持 minimist 启动参数
module.exports = async (args)=>{

    const configFileName = path.join(process.cwd(), '../config', `${args.conf}.json`);
    if (!fs.existsSync(configFileName)) {
        console.error(`配置文件不存在，采集站点使用默认配置启动。${configFileName}`);
    }
    const gs = new ToucanGatherStation(configFileName);

    // 初始化后，采集站自动启动
    await gs.init();

}

