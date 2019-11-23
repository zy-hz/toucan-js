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

const ToucanGatherCell = require('./_gather-cell');
const mqFactory = require('../toucan-message-queue');

class ToucanGatherStationV1 extends ToucanWorkUnit {

    constructor(
        // String - 指定配置文件的文件路径 
        // Object - 配置文件的对象
        options
    ) {

        // 读取配置
        const stationConfig = _.isObject(options) ? options : require('./_gather-station-config')(options);
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
        this.gatherCellPool = buildGatherCellPool(
            _.cloneDeep(this.stationConfig.gatherSkill),
            _.cloneDeep(this.unitInfo),
            this.stationConfig);

        // 自动启动
        if (this.stationConfig.autoStart != false) await this.start();
    }

    // 站点启动
    async start() {

        this.processLog('启动...');
        // 为每个采集单元开启消息监听模式
        for (const gc of this.gatherCellPool.findAll()) {
            await gc.start();
        }

        // 变更为激活状态
        this.workInfo.unitStatus.updateStatus(StatusCode.actived);
    }

    // 站点停止
    async stop() {
        this.processLog('停止中...');
        // 停止每个采集单元的消息监听模式
        for (const gc of this.gatherCellPool.findAll()) {
            await gc.stop();
        }

        // 清理消息队列的连接
        const mqList = _.map(_.uniqWith(this.gatherCellPool.__unitArray__, (a, b) => { return a.gatherMQ === b.gatherMQ }), 'gatherMQ');
        for (const mq of mqList) {
            await mq.disconnect();
        }

        // 变更为空闲状态
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        this.processLog('已停止');

    }

    processLog(msg) {
        return this.log(`${buildGatherStationId(this.unitInfo)} ${msg}`);
    }
}

// 构建采集单元的标记
function buildGatherStationId(unitInfo) {
    return `编号[${unitInfo.unitNo}]采集站[${unitInfo.unitName}]`;
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
function buildGatherCellPool(gatherSkill = {}, stationInfo = {}, options = {}) {
    const { maxGatherCellCount, gatherCells } = gatherSkill;

    if (_.isNil(maxGatherCellCount)) throw new NullArgumentError('maxGatherCellCount');
    if (_.isNil(gatherCells)) throw new NullArgumentError('gatherCells');

    // 创建采集能力的模板
    const skillTemplate = createGatherSkillTemplate(maxGatherCellCount, gatherCells);

    // 构建工作单元池
    const unitPool = new ToucanWorkUnitPool();
    _.forEach(skillTemplate, (skill, index) => {
        const gc = buildGatherCells(skill, index, stationInfo, options);
        if (!_.isNil(gc)) unitPool.add(gc);
    })
    return unitPool
}

// 从模板构建采集单元集合
// index - 能力在采集单元的位置
function buildGatherCells(skill, index, { unitName, unitAddress, unitNo = '' }, {
    messageQueue = { mqType: 'rabbit', mqOptions: {} }
} = {}) {
    if (_.isNil(skill) || skill.skillCapability === 0) return null;

    // 创建采集消息队列
    const gatherMQ = mqFactory.createGatherMQ(messageQueue.mqType, messageQueue.mqOptions);

    let gcs = [];
    for (let i = 0; i < skill.skillCapability; i++) {

        const unitInfo = {
            // 单元名称
            unitName: skill.skillName,
            // 单元的id格式 = 容器id-能力编号(index)
            unitId: `${unitNo}-${_.padStart(index + 1, 2, '0')}`,
            // 单元编号
            unitNo: _.padStart(i + 1, 2, '0'),
            // 单元地址
            unitAddress,
            // 站点的信息
            stationName: unitName,
            stationNo: unitNo,
            stationIp: unitAddress,
        }

        gcs.push(new ToucanGatherCell({ unitInfo, gatherMQ, skillKeys: skill.skillKeys, spiderOptions: skill.skillOptions }))
    }
    return gcs;
}


module.exports = ToucanGatherStationV1;