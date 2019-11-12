//
// 构建MachineInfo对象的md5码
//
const { getObjectMD5 } = require('../../../toucan-utility');

module.exports = (obj) => {
    return getObjectMD5(obj);
}