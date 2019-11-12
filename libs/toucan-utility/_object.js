const { md5 } = require('./_encrypt');
const _ = require('lodash');

function constantize(obj) {
    Object.freeze(obj);
    Object.keys(obj).forEach((key, i) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key]);
        }
    });

    return obj;
}

// 获得对象的md标记
function getObjectMD5(obj) {
    return md5(JSON.stringify(sortByObjectKey(obj)));
}

// 排序对象的属性
function sortByObjectKey(obj) {
    // 如果是数组,使用数组的排序
    if (_.isArray(obj)) return _.sortBy(obj);

    const keys = _.sortBy(_.keys(obj));

    const result = {};
    _.forEach(keys, x => {
        const attr = obj[x];
        result[x] = _.isObject(attr) ? sortByObjectKey(attr) : attr;
    });

    return result;

}

module.exports = { constantize, getObjectMD5 }