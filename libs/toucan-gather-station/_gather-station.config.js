//
// 采集站的配置文件对象
//
const fs = require('fs');
const _ = require('lodash');

// 默认的配置对象
const DEFALUT_CONFIG = {
    // 采集站初始化完成后是否自动启动
    autoStart: true,
    // 采集能力的描述
    gatherSkill: {
        // 本采集站拥有的采集单元的数量
        maxGatherCellCount: 9,
        // 采集单元的集合
        gatherCells: [
            {
                skillName: '通用采集',
                skillDescription: '支持http协议和模拟浏览器采集任务',
                // 关键词用户描写每个采集单元的能力，支持通配符号，例如：
                // cm.* = cm.http + cm.browser
                // sp.ali.* = sp.ali.1688 + sp.ali.trust
                // sp.* = sp.ali.* + sp.jd.* + sp.zhihu.*
                skillKeys: ['cm.http', 'cm.browser'],
                // 能力的数量，支持 整数，小数，和负数
                // >0的整数  - 该采集单元的数量，不超过最大数量，
                // =0       - 表示该引擎不能创建
                // <0的整数 - 数量自动调整
                // 小数     - 表示采集最大数量的百分比，取整
                skillCapability: 3,
            }
        ],
    }
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