const _ = require('lodash');
const fs = require('fs');
const path = require('path');

// 从配置文件中获得配置项
function getConfigObject(...configs) {

    let obj = {};

    _.flatten(configs).forEach(x => {
        const cfg = readFromFile(x);
        obj = Object.assign(obj, _.cloneDeep(cfg));
    })

    return obj;
}

function readFromFile(x) {
    if (!fs.existsSync(x)) return {};
    if (path.extname(x) === '.js') return require(x);
    if (path.extname(x) != '.json') return {};

    const content = fs.readFileSync(x, 'utf-8');
    return JSON.parse(content);
}

module.exports = { getConfigObject }