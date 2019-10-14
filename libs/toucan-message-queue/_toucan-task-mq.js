//
//  Toucan任务队列
//
const ToucanBaseMQ = require('./_toucan-base-mq');
const { NullArgumentError } = require('../toucan-error');

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
}

module.exports = ToucanTaskMQ;