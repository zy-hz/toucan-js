//
// create extract sub task function
//
const _ = require('lodash');
const nullFunction = function () { return [] };

module.exports = ({ extractEnable = false, extractType = '', extractOptions = {} } = {}) => {
    if (!extractEnable) return nullFunction;
    if (!_.isEmpty(extractType)) throw new Error(`extractType指定的提取子任务功能还没有实现。(${extractType})`);

    const BaseSubTaskExtractor = require('./base-extract');
    const obj = new BaseSubTaskExtractor(extractOptions);

    // 使用bind ,保证extract方法可以在委托中调用
    return obj.extract.bind(obj);
}