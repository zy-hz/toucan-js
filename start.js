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
const au = require('./libs/toucan-app/auto-upgrade');

// 启动应用
async function startApp() {

    // 启动更新程序
    // 测试的时候，使用scheduleRule:'*/10 * * * *'
    // 发布的时候，使用随机0-59的分钟
    await au.start({ runAtOnce: true, scheduleRule: '*/10 * * * *' });

    if (_.includes(args._, 'gs')) {
        // 作为采集站点启动
        const startup = require('./libs/toucan-gather-station/startup');
        startup(args);
    } else {
        // 作为服务应用启动
        const app = require('./libs/toucan-app');
        app.start(args);
    }
}

startApp();

