//
// 采集单元池
//
const _ = require('lodash');

class ToucanWorkUnitPool {
    constructor() {

        this.__unitArray__ = []
    }

    // 添加
    add(...workUnits) {
        const ary = _.flattenDeep(workUnits);
        this.__unitArray__ = _.concat(this.__unitArray__, ary);
    }

    findIndex(index) {
        if (index >= this.__unitArray__.length) return null;
        return this.__unitArray__[index];
    }

    findAll() {
        return this.__unitArray__;
    }
    
    // 获取队列的长度
    get length() {
        return this.__unitArray__.length;
    }

}

module.exports = {ToucanWorkUnitPool};