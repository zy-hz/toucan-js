// 
// FileMQ 的消息队列
//
//

const ToucanMQVisitor = require('./_toucan-mq-visitor');
const _ = require('lodash');

class FileMQVisitor extends ToucanMQVisitor {

    constructor(optioins = {}) {
        super(optioins);

        // 创建数据存储
        this.__dataStorage__ = {};
    }

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
    async send(content, { exchange, routeKey,
        // queue = 关联指定的文件
        queue, options = {}
    }) {

        // 初始化数组
        const queueName = queue || '_toucan_default_queue';
        if (_.isNil(this.__dataStorage__[queueName])) this.__dataStorage__[queueName] = []

        // 推入队列
        this.__dataStorage__[queueName].push({ content, isRead: false });
        return true;
    }

    async read({ queue }) {
        const q = _.find(this.__dataStorage__, { 'queueName': queue });
        if (_.isNil(q) || _.isEmpty(q.queueDs)) return false;

        const msg = _.find(q.queueDs, { 'isRead': false });
        if (_.isNil(msg)) return false;

        return msg;
    }
}

module.exports = FileMQVisitor;