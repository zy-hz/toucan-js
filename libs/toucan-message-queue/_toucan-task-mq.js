//
//  Toucan任务队列
//
const ToucanBaseMQ = require('./_toucan-base-mq');

const _ = require('lodash');

class ToucanTaskMQ extends ToucanBaseMQ {

    constructor(mqVisitor, options = {}) {
        super(mqVisitor, options);
    }

    // 发布任务
    async publishTask(tasks) {

        try {
            // 检查空对象
            if (_.isNil(tasks)) throw new NullArgumentError('发布任务');

            // 转换为任务数组
            const ary = _.castArray(tasks);

            // 发布任务
            for (const t of ary) {
                await this.mqVisitor.send(t.taskBody, t.taskOptions)
            }

            return {
                hasException: false,
                taskCount: ary.length,
            }
        }
        catch (error) {
            return {
                hasException: true,
                error,
            }
        }

    }

    // 订阅结果
    async subscribeResult(queue, options = {}) {
        // 获得消费队列的选项
        const { consumeOptions = {} } = options;

        // 尝试从每个队列中获得任务，如果发现任务，下次就从下一个开始
        const msg = await this.mqVisitor.read({ queue, consumeOptions });
        if (_.isBoolean(msg)) return msg;
        
        return _.map(_.castArray(msg), this.extractMessage);
    }
}

module.exports = ToucanTaskMQ;