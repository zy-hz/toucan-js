//
// 采集结果访问器的工厂
//
const { DirResultStore } = require('./_dir-store');

class ResultStoreFactory {

    create(options = {}) {
        return new DirResultStore(options);
    }
}

module.exports = new ResultStoreFactory();