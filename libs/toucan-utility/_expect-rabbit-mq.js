//
// RabbitMQ测试断言

const _ = require('lodash');

class RabbitMQExpect {

    async isConnected(conn) {
        return !_.isNil(conn);
    }

    async getQueueCount(conn,queue){
        const ch = await conn.createChannel();
        const q = await ch.assertQueue(queue);

        return q.messageCount;
    }
}



module.exports = RabbitMQExpect;