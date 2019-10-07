const _ = require('lodash');

// 是否为相同字符串
function isEqualString(strA, strB, ignoreCase = false) {

    return ignoreCase ?
        // 忽略大小写
        _.upperCase(strA) === _.upperCase(strB) :
        // 完全相等
        _.eq(strA, strB);
}

module.exports = { isEqualString };