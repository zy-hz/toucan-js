// 
// RabbitMQ 的采集任务队列
//
//

const ToucanMQVisitor = require('./_toucan-mq-visitor');
const _ = require('lodash');
const amqp = require('amqplib');

class RabbitMQVisitor extends ToucanMQVisitor {

    constructor({
        // 支持 amqp 和 amqps
        protocol = 'amqp',
        // 默认为本地服务器
        host = '127.0.0.1',
        // protocol === 'amqp' ? 5672 : 5671
        port = 5672,
        // 虚拟机
        vhost = '/',
        // 连接主机的用户名
        username = 'guest',
        // 连接主机的密码
        password = 'guest',
        // 指定连接的名称，可以中文
        connection_name = 'RabbitMQVisitor'
    }) {
        super(arguments[0]);

        this.url = { protocol, host, port, vhost, username, password };
        this.socketOptions = { clientProperties: { connection_name } };
    }

    // 连接到消息服务器
    async connect() {
        // 如果已经建立连接，就使用当前连接
        if (!_.isNil(this.conn)) return;

        // 使用参数连接到服务器
        this.conn = await amqp.connect(this.url, this.socketOptions);
    }

    // 断开消息服务器
    async disconnect() {
        if (_.isNil(this.conn)) return;

        await this.conn.close();
        delete this.conn;
    }

}

module.exports = RabbitMQVisitor;