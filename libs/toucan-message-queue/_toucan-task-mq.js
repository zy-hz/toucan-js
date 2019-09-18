//
//  Toucan任务队列
//
const ToucanBaseMQ = require('./_toucan-base-mq');

class ToucanTaskMQ extends ToucanBaseMQ {
    
    constructor(mqVisitor, option = {}) {
        super(mqVisitor, option);
    }
}

module.exports = ToucanTaskMQ;