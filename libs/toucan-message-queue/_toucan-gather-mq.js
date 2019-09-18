//
// 采集消息队列

const ToucanBaseMQ = require('./_toucan-base-mq');

class ToucanGatherMQ extends ToucanBaseMQ {

    constructor(mqVisitor, option = {}) {
        super(mqVisitor, option);
    }
}

module.exports = ToucanGatherMQ;