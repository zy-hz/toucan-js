//
// 采集站 v1
//
// 功能：
// 1. 管理采集单元。采集单元体现采集站的能力
//
const _ = require('lodash');

const { ToucanWorkUnit, ToucanWorkUnitPool } = require('../toucan-work-unit');
const { NullArgumentError } = require('../toucan-error');
const { createGatherSkillTemplate } = require('./_gather-skill');
const ToucanGatherCell = require('../toucan-gather-cell');
const mqFactory = require('../toucan-gather-mq');

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

    // 创建采集能力的模板
    const skillTemplate = createGatherSkillTemplate(maxGatherCellCount, gatherCells);

    // 构建工作单元池
    const unitPool = new ToucanWorkUnitPool();
    _.forEach(skillTemplate, (skill) => {
        const gc = buildGatherCells(skill);
        unitPool.add(gc);
    })
    return unitPool
}

// 从模板构建采集单元集合
function buildGatherCells(skill) {
    if (_.isNil(skill) || skill.skillCapability === 0) return null;

    // 创建采集消息队列
    const mqVisitor = mqFactory.create('rabbit');

    let gcs = [];
    for (let i = 0; i < skill.skillCapability; i++) {
        const unitInfo = {
            // 单元名称
            unitName: skill.skillName,
            // 单元编号
            unitNo: skill.skillCapability === 1 ? '' : _.padStart(i + 1, 2, '0'),
            // 单元地址
            unitAddress: ''
        }

        gcs.push(new ToucanGatherCell({ unitInfo, mqVisitor }))
    }
    return gcs;
}


module.exports = ToucanGatherStationV1;