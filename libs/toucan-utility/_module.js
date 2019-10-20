const fs = require('fs');
const _ = require('lodash');

// 载入工具
function batchLoadModule(
    // 模块目录
    moduleDir,
    // 递归子目录
    recursive = false,
) {

    const dirs = fs.readdirSync(moduleDir);
    // 发现工具库中的每个工具文件
    const utils = _.filter(dirs, (x) => { return /^_\S+\.js$/m.test(x) });

    let funcs = {};
    _.forEach(utils, (x) => {

        try {
            // 每个工具库导致的对象，合并为一个对象
            funcs = Object.assign(funcs, require(moduleDir + '/' + x));
        }
        catch (error) {
            console.log('载入工具库异常：', x, error);
        }

    });

    // 发现子目录中的工具
    if (recursive) {
        const supDirs = _.filter(dirs, (x) => {
            const stat = fs.statSync(`${moduleDir}/${x}`);
            return stat && stat.isDirectory();
        });

        _.forEach(supDirs,(x)=>{
            funcs = Object.assign(funcs,batchLoadModule(`${moduleDir}/${x}`,true));
        })

    }

    return funcs;
}

module.exports = { batchLoadModule };