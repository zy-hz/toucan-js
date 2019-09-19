//
// 采集任务管理中心
//

const { ToucanWorkUnit } = require('../toucan-work-unit')
const { StatusCode } = require('../toucan-utility');
const mqFactory = require('../toucan-message-queue');

class GatherTaskCenter extends ToucanWorkUnit {

    constructor(cfgFileName = '') {
        // 工作单元的状态
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async start() {
        await this._init();
        await this.taskMQ.connect();
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
    }

    // 初始化
    async _init() {
        // 创建消息队列
        this.taskMQ = mqFactory.createTaskMQ('rabbit');
    }

    async stop() {
        await this.taskMQ.disconnect();
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }
}

module.exports = GatherTaskCenter;