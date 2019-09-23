//
//  Toucan任务队列
//
const ToucanBaseMQ = require('./_toucan-base-mq');
const { NullArgumentError } = require('../toucan-error');

const _ = require('lodash');

class ToucanTaskMQ extends ToucanBaseMQ {

    constructor(mqVisitor, option = {}) {
        super(mqVisitor, option);
    }

    // 发布任务
    async publishTask(tasks, options = {}) {

        try {
            // 检查空对象
            if (_.isNil(tasks)) throw new NullArgumentError('发布任务');

            // 构建任务数组
            const ary = _.concat([], tasks);

            // 发布任务

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