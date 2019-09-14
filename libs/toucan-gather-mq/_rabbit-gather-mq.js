// 
// RabbitMQ 的采集消息队列
//
//

const ToucanGatherMQ = require('./_toucan-gather-mq');
const amqp = require('amqplib');

class RabbitGatherMQ extends ToucanGatherMQ {

    // 连接到消息服务器
    async connect(option = {}) {
        // 合并选项
        let opt = Object.assign(this.option,option);
        this.conn = await amqp.connect();
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