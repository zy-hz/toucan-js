//
// 构建MachineInfo对象的md5码
//
const { getObjectMD5 } = require('../../../toucan-utility');
const _ = require('lodash');

module.exports = (obj) => {
    return obj.hostname;
    //return getObjectMD5(obj);
}