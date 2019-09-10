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

    // 类名检查
    return isClassName(obj,expectClassName, ignoreCase);
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



module.exports = isClassExt;
