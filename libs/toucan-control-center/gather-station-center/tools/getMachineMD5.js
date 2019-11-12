//
// 构建MachineInfo对象的md5码 - 采集站点管理中心，使用的配置
//
const { getObjectMD5 } = require('../../../toucan-utility');

module.exports = (obj) => {

    // 提取参与计算的关键因数
    const { hostname, arch, platform, type } = obj;
    return getObjectMD5({ arch, hostname, platform, type });
}