// 
// RabbitMQ 的消息队列
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
        hostname = '127.0.0.1',
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

        this.url = { protocol, hostname, port, vhost, username, password };
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

    // 预备交换机
    async prepareExchange(exName, exType, ...args) {
        // 当前连接是否关闭
        const isClosed = _.isNil(this.conn);
        if (isClosed) await this.connect();

        const ch = await this.conn.createChannel();
        try {
            const funcName = `_prepare${_.capitalize(exType)}Exchange`;
            return await this[funcName](ch, exName, args);
        }
        finally {
            await ch.close();
            // 保持调用前的状态
            if (isClosed) await this.connect();
        }

    }

    async _prepareDirectExchange(ch, exName, args = []) {
        let options = { durable: false };
        if (args.length > 0) {
            options = Object.assign(options, args[0]);
        }
        const ok = await ch.assertExchange(exName, 'direct', options);
        return ok;
    }

    async deleteExchange(exName, options = {}) {
        // 当前连接是否关闭
        const isClosed = _.isNil(this.conn);
        if (isClosed) await this.connect();

        const ch = await this.conn.createChannel();
        try {
            await ch.deleteExchange(exName, options);
        }
        finally {
            await ch.close();
            // 保持调用前的状态
            if (isClosed) await this.connect();
        }
    }

    async deleteQueue(queue) {
        // 当前连接是否关闭
        const isClosed = _.isNil(this.conn);
        if (isClosed) await this.connect();

        const ch = await this.conn.createChannel();
        try {
            for (const q of _.concat([], queue)) {
                await ch.deleteQueue(q);
            }
        }
        finally {
            await ch.close();
            // 保持调用前的状态
            if (isClosed) await this.connect();
        }
    }

    // 发送消息
    async send(content, { exchange, routeKey, queue, options = {} }) {
        // 保证连接，可能被其他使用者断开
        await this.connect();

        // 创建通道
        const ch = await this.conn.createConfirmChannel();
        try {
            // 把对象转为字符串
            if (!_.isString(content)) content = JSON.stringify(content);
            const buf = Buffer.from(content);
            let ok;
            if (!_.isEmpty(queue)) {

                // 使用指定队列发送模式
                ok = await this._sendToQueue(ch, buf, queue, options);
            } else {
                // 
                ok = await this._sendToExchange(ch, buf, exchange, routeKey, options);
            }

            // 消息发送失败，会抛出异常
            await ch.waitForConfirms();
            return ok;
        }
        finally {
            // 关闭通道
            await ch.close();
        }

    }

    // 发送到队列
    async _sendToQueue(ch, buf, queue, options = {}) {
        const { queueOptions, sendOptions } = options;

        // 必须先声明队列，这样当队列不存在时候，就可以新建
        // 如果不声明，将导致消息丢失（没有任何提示）
        const q = await ch.assertQueue(queue, queueOptions);
        if (_.isNil(q) || q.queue != queue) throw Error(`声明队列（${queue}）失败`);

        return await ch.sendToQueue(queue, buf, sendOptions);
    }

    // 发送到交换机
    // 交换机需要提前准备好
    async _sendToExchange(ch, buf, exchange, routeKey, options = {}) {
        const { queueOptions, sendOptions } = options;

        // 如果指定routekey,并且不包含通配符 = direct 或者 topic 类型的exchange
        // 必须先声明队列，这样当队列不存在时候，就可以新建
        // 如果不声明，将导致消息丢失（没有任何提示）
        if (!_.isEmpty(routeKey) && !_.includes(routeKey, '*') && !_.includes(routeKey, '#')) {

            const q = await ch.assertQueue(routeKey, queueOptions);
            if (_.isNil(q) || q.queue != routeKey) throw Error(`声明队列（${routeKey}）失败`);

            // 队列绑定
            await ch.bindQueue(routeKey, exchange, routeKey);
        }

        // 发布消息
        return await ch.publish(exchange, routeKey, buf, sendOptions);
    }

    // 监听消息-通过回调通知
    async receive(onMessage, { queue, queueOptions, consumeOptions }) {
        // 保证连接，可能被其他使用者断开
        await this.connect();

        // 创建通道
        const ch = await this.conn.createChannel();

        try {
            if (!_.isEmpty(queue)) {

                // 声明队列，否在导致消息监听失败
                await ch.assertQueue(queue, queueOptions);

                // 设置消费参数
                const opt = Object.assign({
                    // 消费消息后，需要给服务器发送确认信息
                    // 当指定noAck = true ,这样消费消息后，就从服务器上删除
                    noAck: false,
                    // 同时等待ack确认信息的数量为1
                    waitAckNumber: 1
                }, consumeOptions);

                // 设置每次读1个任务
                await ch.prefetch(opt.waitAckNumber, false);

                // 消费消息
                const msg = await ch.get(queue, opt);

                // 回调处理接收到的消息
                const ok = await onMessage(msg);
                if (ok) {
                    // 发生消息正确处理
                    if (!opt.noAck) await ch.ack(msg);
                } else {
                    // 当noAck = true 时，消费者获得消息后，就从服务器删除该消息了
                    // 所以，当消息处理失败的时候，需要重新推送消息到队列
                    // TODO::这个功能没有生效，请不要使用noAck = true 来发送
                    if (opt.noAck) await ch.nack(msg);
                }

            } else {
                // 
            }
        }
        finally {
            // 关闭通道
            // 
            await ch.close();
        }
    }

    // 从消息队列获得一个消息
    async read({ queue, queueOptions, consumeOptions }) {
        // 保证连接，可能被其他使用者断开
        await this.connect();

        // 创建通道
        const ch = await this.conn.createChannel();

        try {
            // 声明队列，否在导致消息监听失败
            await ch.assertQueue(queue, queueOptions);

            // 设置消费参数
            const opt = Object.assign({
                // 消费消息后，需要给服务器发送确认信息
                // 当指定noAck = true ,这样消费消息后，就从服务器上删除
                noAck: true,
                // 同时等待ack确认信息的数量为1
                waitAckNumber: 1
            }, consumeOptions);

            // 设置每次读1个任务
            await ch.prefetch(opt.waitAckNumber, false);

            // 消费消息
            return await ch.get(queue, opt);
        }
        finally {
            // 关闭通道
            // 
            await ch.close();
        }
    }
}

module.exports = RabbitMQVisitor;