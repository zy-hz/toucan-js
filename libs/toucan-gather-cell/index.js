//
// 采集单元
//
// 功能说明：
// 1. 设置自身的采集能力
// 2. 根据能力获取需要执行的采集任务
// 3. 一次一个，完成（失败）后再获取下一个任务
// 

const { ToucanWorkUnit } = require('../toucan-work-unit');
const _ = require('lodash');

class ToucanGatherCell extends ToucanWorkUnit {

    constructor({
        // 单元资料
        unitInfo = {},
        // 指定构造的时间
        theTime = _.now(),
        // 采集消息队列访问器
        gatherMQ,
        // 拥有的技能
        skillKeys = [],
    } = {}
    ) {
        // 设置默认的采集单元资料
        unitInfo = Object.assign(unitInfo, {
            unitName: unitInfo.unitName || 'GatherCell'
        });

        // ToucanWorkUnit构造器
        super({ unitInfo, theTime });

        // 设置采集消息队列
        this.gatherMQ = gatherMQ;

        // 设置拥有的采集技能
        this.skillKeys = skillKeys;
    }

    // 启动采集单元
    async start() {
        console.log(`${buildGatherCellId(this.unitInfo)} 启动...`);
        // 制定采集任务的消息队列
        this.gatherMQ.bindTaskQueue(this.skillKeys)
        // 启动消息队列的连接
        await this.gatherMQ.connect();

        // 订阅采集任务
        await this.gatherMQ.subscribeTask();
    }

    async stop() {
        console.log(`${buildGatherCellId(this.unitInfo)} 停止`);
        await this.gatherMQ.disconnect();
    }
}

// 构建采集单元的标记
function buildGatherCellId(unitInfo){
    return `采集单元 [${unitInfo.unitName}] 编号[${unitInfo.unitId} ${unitInfo.unitNo}]`
}

module.exports = ToucanGatherCell;
