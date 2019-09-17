//
// 采集站 v1
//
// 功能：
// 1. 管理采集单元。采集单元体现采集站的能力
//
const { ToucanWorkUnit } = require('../toucan-work-unit');
const _ = require('lodash');
const { NullArgumentError } = require('../toucan-error');
const { createGatherSkillTemplates } = require('./_gather-skill');

class ToucanGatherStationV1 extends ToucanWorkUnit {

    constructor(configFileName = '') {
        // 读取配置
        const stationConfig = require('./_gather-station.config')(configFileName);
        // 构造工作单元基类
        super();

        // 保持配置
        this.stationConfig = stationConfig;
    }

    // 站点初始化
    init() {

        // 构造采集单元池
        this.gatherCellPool = buildGatherCellPool(this.stationConfig.gatherSkill);

        // 自动启动
        if (this.stationConfig.autoStart) this.start();
    }

    // 站点启动
    start() {
        console.log('站点启动...');
    }
}

// 构建采集单元池
function buildGatherCellPool(gatherSkill = {}) {
    const { maxGatherCellCount, gatherCells } = gatherSkill;

    if (_.isNil(maxGatherCellCount)) throw new NullArgumentError('maxGatherCellCount');
    if (_.isNil(gatherCells)) throw new NullArgumentError('gatherCells');

    // 创建采集能力
    const skillTemplate = createGatherSkillTemplates(maxGatherCellCount, gatherCells);

    return { unitCount: 2 }
}


module.exports = ToucanGatherStationV1;