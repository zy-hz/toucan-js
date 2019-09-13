const BaseMQVisitor = require('./_base-mq-visitor');

class RabbitMQVisitor extends BaseMQVisitor {
    
    constructor(option) {
        super(option);
    }
}

module.exports = RabbitMQVisitor;