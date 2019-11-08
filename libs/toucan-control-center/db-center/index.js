//
// 数据中心
//
const { mapDirToModule_v2 } = require('../../toucan-utility');

// 更加选项创建数据中心
function createDbCenter() {
    return mapDirToModule_v2(__dirname);
}

module.exports = createDbCenter;