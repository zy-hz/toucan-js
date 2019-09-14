//
// RabbitMQ测试断言

const _ = require('lodash');

class RabbitMQExpect {

    async isConnected(conn){
        return !_.isNil(conn);
    }
}



module.exports = RabbitMQExpect;