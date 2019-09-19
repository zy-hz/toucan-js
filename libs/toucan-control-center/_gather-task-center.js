//
// 采集任务管理中心
//

const { ToucanWorkUnit } = require('../toucan-work-unit')
const { StatusCode } = require('../toucan-utility');
const mqFactory = require('../toucan-message-queue');

class GatherTaskCenter extends ToucanWorkUnit {

    constructor(cfgFileName = '') {
        super();
    }

    async start() {
        await this._init();
        await this.taskMQ.connect();

        this.workInfo.unitStatus.updateStatus(StatusCode.actived);
    }

    // 初始化
    async _init() {
        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ('rabbit');
    }

    async stop() {
        await this.taskMQ.disconnect();
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
    }
}

module.exports = GatherTaskCenter;