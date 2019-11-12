const fs = require('fs');
const _ = require('lodash');
const path = require('path');

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
    c = deleteAttr(c);

    // 转为json存储
    const cnt = JSON.stringify(c);

    const dir = path.dirname(f);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(f, cnt);
}

function deleteAttr(c) {
    const obj = _.cloneDeep(c);

    // 删除不需要的属性
    delete obj.cacheFileName;

    // 删除内部属性，以下划线开头的属性
    _.forEach(obj, (val, key) => {
        if (_.startsWith(key, '_')) delete obj[`${key}`];
    })
    return obj;
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

        writeCacheToFile(this, this.cacheFileName);
    }

    clear() {
        // 保存文件名，因为后面对象会被删除
        const tmpFile = this.cacheFileName;

        _.forEach(this, (val, key) => {
            if (!_.isFunction(val)) delete this[`${key}`];
        })

        this.cacheFileName = tmpFile;
        writeCacheToFile({}, this.cacheFileName);
    }
}