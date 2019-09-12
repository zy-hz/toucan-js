//
// 组合状态机
//

const _ = require('lodash');

class StatusGroup {

    constructor(statusArray, theTime = _.now()) {

        // 设置状态
        this.__statusArray__ = statusArray;

        // 设置为默认的状态
        this.updateStatus(statusArray[0],theTime);
    }

    // 初始化状态值为false
    initStatusValue() {
        // 构造状态组的属性
        _.forEach(this.__statusArray__, (code) => {
            this.setStatusValue(code, false);

        })
    }

    // 设置属性值
    setStatusValue(code, val) {
        const attrName = `is${_.capitalize(code)}`;
        this[attrName] = val;
    }

    // 更新状态
    updateStatus(code, theTime = _.now()) {
        // 初始化状态值
        this.initStatusValue();

        // 设置状态值
        this.setStatusValue(code, true);
        this.status = code;
    }

}

// 状态码
const StatusCode = {
    // 激活中
    actived: 'actived',
    // 空闲中
    idle: 'idle',
    // 挂起中
    suspend: 'suspend'
}

module.exports = { StatusGroup, StatusCode };