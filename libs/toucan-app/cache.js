const fs = require('fs');
const _ = require('lodash');

// 从指定的文件读取配置
function readCacheFromFile(f) {
    if (!fs.existsSync(f)) return {};

    try {
        return JSON.parse(fs.readFileSync(f, 'utf8'));
    }
    catch (error) {
        console.error(`从文件读取缓存失败。(${f})`, error);
        return {}
    }

}

module.exports = class {

    init(f) {
        this.cacheFileName = f;
        _.assign(this, readCacheFromFile(f));
    }
}