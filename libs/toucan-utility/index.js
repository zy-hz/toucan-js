const fs = require('fs');
const _ = require('lodash');

// 载入工具
function loadUtils() {

    const dirs = fs.readdirSync(__dirname);
    // 发现工具库中的每个工具文件
    const utils = _.filter(dirs, (x) => { return /^_\S+\.js$/m.test(x) });

    let funcs = {};
    _.forEach(utils, (x) => {

        try {
            // 每个工具库导致的对象，合并为一个对象
            funcs = Object.assign(funcs,require(__dirname + '/' + x));
        }
        catch (error) {
            console.log('载入工具库异常：', x, error);
        }

    });

    return funcs;
}

module.exports = loadUtils();