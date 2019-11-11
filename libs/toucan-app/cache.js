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

// 缓存写入文件
function writeCacheToFile(c, f) {
    // 删除不需要的属性
    delete c.cacheFileName;

    // 转为json存储
    const cnt = JSON.stringify(c);
    fs.writeFileSync(f, cnt);
}

module.exports = class {

    init(f) {
        this.cacheFileName = f;
        _.assign(this, readCacheFromFile(f));
    }

    set(obj, val) {
        if (_.isString(obj)) {
            const newObj = {};
            newObj[`${obj}`] = val;
            obj = newObj;
        }

        _.assign(this, obj);

        writeCacheToFile(_.cloneDeep(this), this.cacheFileName);
    }
}