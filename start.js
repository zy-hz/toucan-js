//
// 启动各种app
//
// 程序读取默认的配置文件（在app对应的目录中），也读去用户自定配置文件。 自定义配置可以放在两个位置
// 第一位置： /data/release/config/
// 第二位置： ../config/
// 如果都存在，第一位置的配置优先

// 启动服务
// node start gsc|gtc|grc
//

// 启动采集站点
// node start gs --conf <配置文件，例如：1688-detail>

const args = require('minimist')(process.argv.slice(2));
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

if (_.includes(args._, 'gs')) {
    // 作为采集站点启动
    const ToucanGatherStation = require('./libs/toucan-gather-station');
    const configFileName = path.join(process.cwd(), '../config', `${args.conf}.json`);
    if (!fs.existsSync(configFileName)) {
        console.error(`配置文件不存在，采集站点使用默认配置启动。${configFileName}`);
    }
    const gs = new ToucanGatherStation(configFileName);

    // 初始化后，采集站自动启动
    gs.init();
} else {
    // 作为服务启动
    const app = require('./libs/toucan-app');
    app.start(args);
}
