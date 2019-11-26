//
// 采集消息队列
const { NullArgumentError } = require('../toucan-error');
const ToucanBaseMQ = require('./_toucan-base-mq');
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
        this.__taskBindQueue = _.concat([], _.castArray(fromQueues));
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
    async subscribeTask({ consumeOptions = {} } = {}) {
        // 尝试从每个队列中获得任务，如果发现任务，下次就从下一个开始
        const maxTryCount = this.__taskBindQueue.length;
        let tryNum = 0;
        while (tryNum < maxTryCount) {
            // 获得订阅的队列名称，例如：toucan.cm.http
            const queue = this.popTaskQueue();

            // 从服务器获得消息
            const msg = await this.mqVisitor.read({ queue, consumeOptions })

            if (msg != false) return this.extractMessage(msg);
            tryNum = tryNum + 1;
        }

        return false;
    }

    // 提交结果
    async submitResult(result, options) {

        try {
            // 检查空对象
            if (_.isNil(result)) throw new NullArgumentError('采集结果对象不能空');

            // 提交到消息队列
            await this.mqVisitor.send(result, options);

            return {
                hasException: false,
            }
        }
        catch (error) {
            return {
                hasException: true,
                error,
            }
        }
    }
}



module.exports = ToucanGatherMQ;