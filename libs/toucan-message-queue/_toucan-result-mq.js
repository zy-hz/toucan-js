//
// 采集结果队列
//

const ToucanGatherMQ = require('./_toucan-gather-mq');
const _ = require('lodash');

class ToucanResultMQ extends ToucanGatherMQ {

    constructor(mqVisitor, options = {}) {
        super(mqVisitor, options);
    }

    // 绑定结果队列
    async bindResultQueue(fromQueue = []) {
        // 使用任务队列的绑定方法
        super.bindTaskQueue(fromQueue);
    }

    // 订阅采集结果
    async subscribeResult(options = {}) {
        // 使用订阅采集任务一样的方法
        const msg = await super.subscribeTask(options);
        if (_.isBoolean(msg)) return msg;

        return this.extractMessage(msg);
    }
}

module.exports = ToucanResultMQ;