// 检查一个对象是否为类
//

const _ = require('lodash');
const isClass = require('isclass');
const { isEqualString } = require('./_string');

function isClassExt(
    obj,
    // 期望的类名
    expectClassName = '',
    // 比较类名是否忽悠大小写
    ignoreCase = false,
) {
    if (_.isNil(obj)) return false;
    // 如果不是类，放弃以下检查
    if (!isClass(obj)) return false;

    // 以下代码，都是针对类的检查
    //

    // 如果不需要检查类名，直接返回
    if (_.isEmpty(expectClassName)) return true;

    // 类名检查
    return isClassName(obj, expectClassName, ignoreCase);
}

// 比较大小写
function isClassName(obj, expectClassName, ignoreCase = false) {
    let objPrototype = obj.prototype;

    while (!_.isNil(objPrototype) && !_.isNil(objPrototype.constructor)) {

        let className = objPrototype.constructor.name;
        if (isEqualString(className, expectClassName, ignoreCase)) return true;

        // 检查原型链的上一级
        objPrototype = objPrototype.__proto__;
    }

    return false
}

// 获得对象的类名
function getObjectClassName(obj) {
    if (_.isNil(obj)) return '';

    if (_.isNil(obj.__proto__) || _.isNil(obj.__proto__.constructor)) return '';
    return obj.__proto__.constructor.name;
}

function isObjectEx(obj,
    // 期望的类名
    expectClassName = ''
) {
    if (_.isNil(obj) || _.isNil(obj.__proto__)) return false;
    if (_.isEmpty(expectClassName)) return _.isObject(obj);

    const constructor = obj.__proto__.constructor;
    if (_.isNil(constructor)) return false;

    if (isEqualString(constructor.name, expectClassName, true)) return true;

    return isObjectEx(obj.__proto__, expectClassName);
}

module.exports = { isClass: isClassExt, isObject: isObjectEx, getObjectClassName };
