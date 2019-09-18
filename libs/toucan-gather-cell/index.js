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
    } = {}
    ) {
        // 设置默认的采集单元资料
        unitInfo = Object.assign(unitInfo, {
            unitName: unitInfo.unitName || 'GatherCell'
        });

        // ToucanWorkUnit构造器
        super({ unitInfo, theTime });

        //
        this.gatherMQ = gatherMQ;
    }

    // 启动采集单元
    async start() {
        console.log(this.unitInfo.unitName, this.unitInfo.unitId, this.unitInfo.unitNo, '启动中...')
        await this.gatherMQ.connect();
    }

    async stop() {
        console.log(this.unitInfo.unitName, this.unitInfo.unitId, this.unitInfo.unitNo, '停止')
        await this.gatherMQ.disconnect();
    }

}

module.exports = ToucanGatherCell;
