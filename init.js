//
// 初始化各种app
//
// 程序读取默认的配置文件（在app对应的目录中），也读去用户自定配置文件。 自定义配置可以放在两个位置
// 第一位置： /data/release/config/
// 第二位置： ../config/
// 如果都存在，第一位置的配置优先

// 启动初始化
// node init gsc|gtc|grc
//

const args = require('minimist')(process.argv.slice(2));
const app = require('./libs/toucan-app');

app.init(args);

