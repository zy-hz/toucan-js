// 支持日志
const _ = require('lodash');
const moment = require('moment');

class ToucanLogger {

    constructor({
        // 添加类型信息
        addTypeInfo = true,
        // 空表示忽略
        addDateInfo = 'YYYY-MM-DD',
        // 空表示忽略
        addTimeInfo = 'HH:mm:ss'
    } = {}) {

        this.addTypeInfo = addTypeInfo;
        this.addDateInfo = addDateInfo;
        this.addTimeInfo = addTimeInfo;
    }

    log(...optionalParams) {
        this.__output__(console.log, 'info', optionalParams);
    }
    warn(...optionalParams) {
        this.__output__(console.warn, 'warn', optionalParams);
    }
    error(...optionalParams) {
        this.__output__(console.error, 'error', optionalParams);
    }
    // 分割线
    split(splitChar = '*', msg = '') {
        const padStr = _.padEnd('', Math.floor(72 / 2 - msg.length / 2), splitChar);
        this.log(`${padStr}${msg}${padStr}`);
    }

    __output__(func, type, optionalParams) {
        let pms = [];
        if (this.addTypeInfo) pms.push(buildTypeInfo(type));
        if (!_.isEmpty(this.addDateInfo)) pms.push(buildDateInfo(this.addDateInfo))
        if (!_.isEmpty(this.addTimeInfo)) pms.push(buildTimeInfo(this.addTimeInfo))

        pms.push(buildInfo(optionalParams));

        // 调用实际得输出
        func(pms.join(' '));
    }
}

function buildTypeInfo(info) {
    return `[${info}]`;
}

function buildDateInfo(fm) {
    return moment().format(fm);
}

function buildTimeInfo(fm) {
    return moment().format(fm);
}

function buildInfo(optionalParams) {
    return _.map(optionalParams, (x) => {
        return typeof x === 'object' ? JSON.stringify(x) : x;
    }).join(' ')
}

module.exports = { ToucanLogger };