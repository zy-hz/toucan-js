//
// 采集站的配置文件对象
//
const fs = require('fs');
const _ = require('lodash');

// 默认的配置对象
const DEFALUT_CONFIG = {

}

function getConfig(fileName = '') {
    // 运行时指定的文件
    const runConfig = readConfigFromFile(fileName);
    // app目录下的文件
    const appConfig = readConfigFromFile(`${process.cwd()}/gsconfig.json`);

    // 运行时的配置最优先，用户可以在运行时指定动态的配置
    return Object.assign(DEFALUT_CONFIG, appConfig, runConfig);
}

// 从指定文件读取配置
function readConfigFromFile(fileName) {
    if (!fs.existsSync(fileName)) return {};

    try {
        const content = fs.readFileSync(fileName, 'utf8')
        return JSON.parse(content)
    } catch (e) {
        // 如果配置读取错误或者 JSON 解析错误，则输出空配置项
        console.log(`${fileName} 解析错误，不是 JSON 字符串`)
        return {}
    }
}

module.exports = getConfig;