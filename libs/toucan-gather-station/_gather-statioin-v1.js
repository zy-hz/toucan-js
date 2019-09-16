//
// 采集站 v1
//
// 功能：
// 1. 管理采集单元。采集单元体现采集站的能力
//
const ToucanWorkUnit = require('../toucan-work-unit');

class ToucanGatherStationV1 extends ToucanWorkUnit {

    constructor(configFileName = '') {
        // 读取配置
        const stationConfig = require('./_gather-station.config')(configFileName);
        // 构造工作单元基类
        super();

        // 保持配置
        this.stationConfig = stationConfig;
    }
}

module.exports = ToucanGatherStationV1;