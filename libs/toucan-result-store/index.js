//
// 采集结果存储器的工厂
//
const _ = require('lodash');
const path = require('path');
const find = require('find');

class ResultStoreFactory {

    async create(options = { storeType: '', storeOptions: {} },
        // 忽略初始化，测试的时候可以使用
        ignoreInit = false
    ) {
        const engFile = getStoreEngineFile(options.storeType);
        const engClass = require(engFile);
        // 建议使用storeOptions，如果没有storeOptions，那么options对象作为storeOptions
        const engObj = new engClass(options.storeOptions || options);
        // 调用异步的初始化接口
        if (!ignoreInit) await engObj.init(options.storeOptions || options);
        return engObj
    }
}

function getDefaultEngileFile() {
    return path.resolve(__dirname, 'cm-store', 'tc-dir.js');
}

function getStoreEngineFile(storeType) {
    if (_.isEmpty(storeType)) return getDefaultEngileFile();

    const files = find.fileSync(`${storeType}.js`, __dirname);
    if (_.isEmpty(files)) return getDefaultEngileFile();

    return files[0];
}


module.exports = {
    rsFactory: new ResultStoreFactory()
}
