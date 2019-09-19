//
// 组合状态机
//

const _ = require('lodash');

class StatusGroup {

    constructor(statusArray, theTime = _.now()) {

        // 设置状态
        this.__statusArray__ = statusArray;

        // 设置为默认的状态
        this.updateStatus(statusArray[0], theTime);
    }

    // 初始化状态值为false
    initStatusValue() {
        // 构造状态组的属性
        _.forEach(this.__statusArray__, (code) => {
            this.setStatusValue(code, false);

        })
    }

    // 初始化状态持续时间相关的属性
    initStatusDurationAttr() {
        _.forEach(this.__statusArray__, (code) => {
            this.setLastStatueChangeTime(code, 0);
            this.setStatusDurationTime(code, 0);
        })
    }

    // 更新状态
    updateStatus(code = this.statusCode, theTime = _.now()) {
        // 计算状态持续的时间，该方法会修改对象的相关属性值
        this.calStatusDuration(this.statusCode, code, theTime);

        // 初始化状态值（清除）
        this.initStatusValue();

        // 切换到新的状态值
        this.setStatusValue(code, true);
        this.statusCode = code;
        this.__statusChangeTime__ = theTime;
    }

    // 计算当前状态的持续时间
    calStatusDuration(oldStatus, newStatus, theTime = _.now()) {
        // 如果没有状态值，表示时刚启动，则初始化相关属性
        if (_.isNil(oldStatus)) {
            this.initStatusDurationAttr()
        }

        const lastStatusTime = this[lastStatusChangeTimeAttrName(oldStatus)] || theTime;
        const statusDurationTime = this[statusDurationTimeAttrName(oldStatus)] || 0;

        // 合计持续时间
        this.setStatusDurationTime(oldStatus, theTime - lastStatusTime + statusDurationTime);

        if (oldStatus != newStatus) {
            // 设置新状态检查时间
            this.setLastStatueChangeTime(newStatus, theTime)
        }
    }


    // 设置属性值 - 状态
    setStatusValue(code, val) {
        const attrName = `is${_.capitalize(code)}`;
        this[attrName] = val;
    }

    // 设置上次属性变更的时间
    setLastStatueChangeTime(code, val) {
        const lastStatusChangeTime = lastStatusChangeTimeAttrName(code)
        this[lastStatusChangeTime] = val;
    }

    // 设置属性持续时间
    setStatusDurationTime(code, val) {
        const statusDurationTime = statusDurationTimeAttrName(code);
        this[statusDurationTime] = val;
    }
}

function lastStatusChangeTimeAttrName(code) {
    return `last${_.capitalize(code)}ChangeTime`;
}

function statusDurationTimeAttrName(code) {
    return `${_.lowerCase(code)}DurationTime`;
}


// 状态码
const StatusCode = {
    // 激活中
    actived: 'actived',
    // 关闭中
    closed: 'closed',
    // 空闲中
    idle: 'idle',
    // 挂起中
    suspend: 'suspend'
}

module.exports = { StatusGroup, StatusCode };