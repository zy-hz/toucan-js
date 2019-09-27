//
// 采集消息队列

const ToucanBaseMQ = require('./_toucan-base-mq');
const { sleep } = require('../toucan-utility');
const _ = require('lodash');

class ToucanGatherMQ extends ToucanBaseMQ {

    constructor(mqVisitor, options = {}) {
        super(mqVisitor, options);
    }

    // 绑定采集任务的队列
    // fromQueues
    // 1. 订阅的队列列表，例如：toucan.cm.http,toucan.sp.com.ali
    // 2. 多个队列的时候，轮流获得队列中的任务
    bindTaskQueue(fromQueues = []) {
        this.__taskBindQueue = _.concat([], fromQueues);
    }

    // 弹出当前的队列，并把他推入队列的末尾
    popTaskQueue(toEnd = true) {
        const first = _.pullAt(this.__taskBindQueue, 0);

        if (toEnd) {
            // 把第一个元素放到最后
            this.__taskBindQueue = _.concat(this.__taskBindQueue, first);
        } else {
            // 把第一个元素放到第一个
            this.__taskBindQueue = _.concat(first, this.__taskBindQueue);
        }

        return _.head(first);
    }

    // 订阅采集任务
    async subscribeTask() {
        // 获得订阅的队列名称，例如：toucan.cm.http
        const queue = this.popTaskQueue();

        await this.mqVisitor.receive(async (msg) => {

            console.log(msg.content.toString());
            await sleep(1000);
            return true;

        }, { queue })
    }
}



module.exports = ToucanGatherMQ;