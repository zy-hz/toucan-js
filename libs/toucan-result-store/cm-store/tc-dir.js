//
// 目录存储
//
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const ToucanBaseResultStore = require('../_base-store');

class DirResultStore extends ToucanBaseResultStore {
    constructor({
        // 输出的目录
        outDir } = {}
    ) {
        super();
        
        this.outDir = path.resolve(process.cwd(), outDir);
        if (!fs.existsSync(this.outDir)) fs.mkdirSync(this.outDir, { recursive: true });
    }

    async save(obj) {
        const ary = _.castArray(obj);
        _.forEach(ary, x => { saveResult(x, this.outDir) });
    }
}

// 保存结果到指定目录
function saveResult(msg, outDir) {
    const fileName = buildTimeStampFileName(outDir);
    const content = JSON.stringify(msg)
    fs.writeFileSync(fileName, content);

    return fileName
}

// 根据时间获得文件名
function buildTimeStampFileName(dirName) {
    let tick = _.now();
    let fileName = ''
    do {
        fileName = `${dirName}/${tick}.dat`;
        tick = tick + 1;
    } while (fs.existsSync(fileName));
    return fileName;
}

module.exports = DirResultStore;