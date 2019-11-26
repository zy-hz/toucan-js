//
// 生成对象的md5Ma
//

const { getObjectMD5 } = require('../../../toucan-utility');
const _ = require('lodash');

module.exports = (obj) => {
    return getObjectMD5({ obj, timeStamp: _.now() });
}