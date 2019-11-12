const fs = require('fs');
const _ = require('lodash');
const path = require('path');

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

        _.forEach(supDirs, (x) => {
            funcs = Object.assign(funcs, batchLoadModule(`${moduleDir}/${x}`, true));
        })

    }

    return funcs;
}

// 影射目录为模块
function mapDirToModule(d) {
    const tree = {}

    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    // 映射文件夹
    dirs.forEach(dir => {
        tree[dir] = mapDirToModule(path.join(d, dir))
    })

    // 映射文件
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            tree[path.basename(file, '.js')] = require(path.join(d, file))
        }
    })

    return tree
}

// 影射目录为模块
function mapDirToModule_v2(d) {
    const tree = {}

    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    // 映射文件夹
    dirs.forEach(dir => {
        tree[dir] = mapDirToModule_v2(path.join(d, dir))
    })

    // 映射文件
    files.forEach(file => {
        if (_.startsWith(file, '_') && path.extname(file) === '.js') {
            const obj = require(path.join(d, file));
            if (_.isFunction(obj) || _.isObject(obj)) {
                // 这是一个函数，使用文件名（去掉前导的下划线）
                tree[_.trimStart(path.basename(file, '.js'), '_')] = obj;
            }

            // 将来，这里可以加入对于类的处理
        }
    })

    return tree
}

module.exports = { batchLoadModule, mapDirToModule, mapDirToModule_v2 };