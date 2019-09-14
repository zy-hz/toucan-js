// 
// RabbitMQ 的采集消息队列
//
//

const ToucanGatherMQ = require('./_toucan-gather-mq');
const _ = require('lodash');
const amqp = require('amqplib');

class RabbitGatherMQ extends ToucanGatherMQ {

    // 连接到消息服务器
    async connect(option = {}) {
        // 如果已经建立连接，就使用当前连接
        if (!_.isNil(this.conn)) return;

        // 合并选项
        let opt = Object.assign(this.option, option);
        this.conn = await amqp.connect('amqp://127.0.0.1:5672',{
            clientProperties: {
                connection_name: '我是仗义'
            }
        });
    }

    // 断开消息服务器
    async disconnect() {
        if (_.isNil(this.conn)) return;

        await this.conn.close();
        delete this.conn;
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