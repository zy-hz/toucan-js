//
// 任务中心的配置文件对象
//
const fs = require('fs');
const _ = require('lodash');
const path = require('path');

// 默认的配置对象
const DEFALUT_CONFIG = {
    // 消息队列的类型
    taskMQType:'rabbit',
    // 初始化后自动启动
    autoStart:true,
    // 发布采集任务的交换机
    exchangeName:'toucan.gather.task',
    // 任务数据的读取接口
    taskDbVisitor:'',
}

function getConfig(fileName = '') {
    // 运行时指定的文件
    const runConfig = readConfigFromFile(fileName);

    // 运行时的配置最优先，用户可以在运行时指定动态的配置
    let cfg =  Object.assign(_.cloneDeep(DEFALUT_CONFIG), runConfig);
    cfg.taskDbVisitor = fixPath(cfg.taskDbVisitor,fileName);

    return cfg;
}

// 修复路径
function fixPath(fn,referPath){
    if(_.isEmpty(fn)) return fn;
    if(fs.existsSync(fn)) return fn;

    const dir = path.dirname(referPath);
    let tryName = path.resolve(dir,fn);
    if(fs.existsSync(tryName)) return tryName.replace(/\\/img,'/');

    return fn;
}


// 从指定文件读取配置
function readConfigFromFile(fileName) {
    if (!fs.existsSync(fileName)) return {};

    try {
        const content = fs.readFileSync(fileName, 'utf8');
        const { gatherTaskCenter } = JSON.parse(content);
        return gatherTaskCenter;
    } catch (e) {
        // 如果配置读取错误或者 JSON 解析错误，则输出空配置项
        console.log(`${fileName} 解析错误，不是 JSON 字符串`)
        return {}
    }
}

module.exports = getConfig;