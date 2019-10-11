// 
// FileMQ 的消息队列
//
//

const ToucanMQVisitor = require('./_toucan-mq-visitor');
const _ = require('lodash');

class FileMQVisitor extends ToucanMQVisitor {

    // 连接到消息服务器
    async connect() {
    }

    // 断开消息服务器
    async disconnect() {
    }

    // 删除队列
    async deleteQueue(queue) {

    }

    // 发送消息
    async send(content, { exchange, routeKey, queue, options = {} }) {
        let ok = true;
        return ok;
    }

    async read({ queue, queueOptions, consumeOptions }) {
        let msg = { content: 'ok' };
        return msg;
    }
}

module.exports = FileMQVisitor;