//
// 采集站 v1
//
// 功能：
// 1. 管理采集单元。采集单元体现采集站的能力
//
const _ = require('lodash');
const os = require('os');

const { ToucanWorkUnit, ToucanWorkUnitPool } = require('../toucan-work-unit');
const { NullArgumentError } = require('../toucan-error');
const { createGatherSkillTemplate } = require('./_gather-skill');
const { StatusCode, getIpAdress } = require('../toucan-utility');

const ToucanGatherCell = require('../toucan-gather-cell');
const mqFactory = require('../toucan-message-queue');

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
    async init() {
        // 设置站点的Ip地址
        this.unitInfo = await buildStationUnitInfo(_.cloneDeep(this.stationConfig));

        // 构造采集单元池
        this.gatherCellPool = buildGatherCellPool(_.cloneDeep(this.stationConfig.gatherSkill), _.cloneDeep(this.unitInfo));

        // 自动启动
        if (this.stationConfig.autoStart) await this.start();
    }

    // 站点启动
    async start() {

        // 为每个采集单元开启消息监听模式
        for (const gc of this.gatherCellPool.findAll()) {
            await gc.start();
        }

        // 变更为激活状态
        this.workInfo.unitStatus.updateStatus(StatusCode.actived);
    }

    // 站点停止
    async stop() {
        // 为每个采集单元开启消息监听模式
        for (const gc of this.gatherCellPool.findAll()) {
            await gc.stop();
        }

        // 变更为空闲状态
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
    }
}

// 构建站点的单元资讯
async function buildStationUnitInfo({ stationName, stationNo }) {
    const unitName = stationName || os.hostname();
    // 这个方法有点慢，暂时不用
    //const unitAddress = await publicIp.v4();
    const unitAddress = getIpAdress();

    return {
        unitName,
        unitAddress,
        unitNo: stationNo,
    }
}

// 构建采集单元池
function buildGatherCellPool(gatherSkill = {}, stationInfo = {}) {
    const { maxGatherCellCount, gatherCells } = gatherSkill;

    if (_.isNil(maxGatherCellCount)) throw new NullArgumentError('maxGatherCellCount');
    if (_.isNil(gatherCells)) throw new NullArgumentError('gatherCells');

    // 创建采集能力的模板
    const skillTemplate = createGatherSkillTemplate(maxGatherCellCount, gatherCells);

    // 构建工作单元池
    const unitPool = new ToucanWorkUnitPool();
    _.forEach(skillTemplate, (skill, index) => {
        const gc = buildGatherCells(skill, index, stationInfo);
        unitPool.add(gc);
    })
    return unitPool
}

// 从模板构建采集单元集合
// index - 能力在采集单元的位置
function buildGatherCells(skill, index, { unitAddress, unitId = '' }) {
    if (_.isNil(skill) || skill.skillCapability === 0) return null;

    // 创建采集消息队列
    const gatherMQ = mqFactory.createGatherMQ('rabbit');

    let gcs = [];
    for (let i = 0; i < skill.skillCapability; i++) {

        const unitInfo = {
            // 单元名称
            unitName: skill.skillName,
            // 单元的id格式 = 容器id-能力编号(index)
            unitId: `${unitId}-${_.padStart(index + 1, 2, '0')}`,
            // 单元编号
            unitNo: _.padStart(i + 1, 2, '0'),
            // 单元地址
            unitAddress
        }

        gcs.push(new ToucanGatherCell({ unitInfo, gatherMQ, skillKeys: skill.skillKeys }))
    }
    return gcs;
}


module.exports = ToucanGatherStationV1;