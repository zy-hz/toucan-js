// 
// RabbitMQ Short Connection 版本接口
//
// 生产消息前创建connection ,生成消息后connection关闭
// 消费消息前创建connection，消费消息后connection关闭
//

const ToucanGatherMQ = require('./_toucan-gather-mq');
const amqp = require('amqplib');

class RabbitGatherMQ extends ToucanGatherMQ {

    constructor(option = {}) {
        super(option);
    }

    // 发布消息
    async publish(content, head = {}) {
        const conn = await amqp.connect();
        const ch = await conn.createChannel();

        const queueName = head;
        let ok = await ch.assertQueue(queueName);
        await ch.sendToQueue(queueName, new Buffer(content));

        await ch.close();
        //await conn.close();

    }
}

module.exports = RabbitGatherMQ;