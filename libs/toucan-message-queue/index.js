//
// 采集消息队列工厂
//

const _ = require('lodash');
const mqvCreate = require('../toucan-mq-visitor');

const ToucanGatherMQ = require('./_toucan-gather-mq');
const ToucanTaskMQ = require('./_toucan-task-mq');
const ToucanResultMQ = require('./_toucan-result-mq');

class ToucanMessageQueueFactory {

    // 创建采集消息队列
    createGatherMQ(mqType = 'toucan', option = {}) {

        const mqv = mqvCreate(mqType, option);
        return new ToucanGatherMQ(mqv, option);
    }

    // 创建任务消息队列
    createTaskMQ(mqType = 'toucan', option = {}) {

        const mqv = mqvCreate(mqType, option);
        return new ToucanTaskMQ(mqv, option);
    }

    // 创建采集结果消息队列
    createResultMQ(mqType = 'toucan', option = {}) {

        const mqv = mqvCreate(mqType, option);
        return new ToucanResultMQ(mqv, option);
    }

}

module.exports = new ToucanMessageQueueFactory();
