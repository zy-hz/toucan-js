// 
// FileMQ 的消息队列
//
//

const ToucanMQVisitor = require('./_toucan-mq-visitor');
const fs = require('fs');
const _ = require('lodash');

const DEFAULT_CACHE_PATH = process.cwd() + '/cache/filemq';

class FileMQVisitor extends ToucanMQVisitor {

    constructor(optioins = {}) {
        super(optioins);

        const {
            // 文件缓存的目录
            mqCachePath = DEFAULT_CACHE_PATH
        } = optioins;

        this.mqCachePath = mqCachePath;
        this.init();

    }

    // 初始化消息队列
    init() {
        // 创建缓存目录
        if (!fs.existsSync(this.mqCachePath)) {
            fs.mkdirSync(this.mqCachePath, { recursive: true });
        }
        // 创建数据存储
        this.__dataStorage__ = {};
    }

    // 初始化队列
    initQueue(queueName) {

        if (!_.isNil(this.__dataStorage__[queueName])) return;

        const fileName = `${this.mqCachePath}/${queueName}`;
        this.__dataStorage__[queueName] = []

        if (!fs.existsSync(fileName)) return;

        // 读取
        const lines = _.split(fs.readFileSync(fileName, 'utf-8'), '\r\n');
        _.forEach(lines, (x) => {
            try {
                const msg = JSON.parse(x)
                this.appendToStorage(queueName, msg, false)
            }
            catch (error) { }
        });
    }

    // 连接到消息服务器
    async connect() {
    }

    // 断开消息服务器
    async disconnect() {
        // 将缓存内容写入文件
        _.each(this.__dataStorage__, (x) => {

        })
    }

    // 删除队列
    async deleteQueue(queue) {
        _.forEach(_.concat([], queue), (queueName) => {
            const fileName = `${this.mqCachePath}/${queueName}`;
            if (fs.existsSync(fileName)) fs.unlinkSync(fileName);

            // 删除对象
            delete this.__dataStorage__[queueName];
        });

    }

    // 发送消息
    async send(content, { exchange, routeKey,
        // queue = 关联指定的文件
        queue, options = {}
    }) {

        // 初始化数组
        const queueName = queue || '_toucan_default_queue';
        this.initQueue(queueName)

        // 推入队列
        const msg = { content, isRead: false }
        this.appendToStorage(queueName, msg);
        return true;
    }

    async read({ queue }) {
        // 初始化数组
        const queueName = queue || '_toucan_default_queue';
        this.initQueue(queueName);

        const q = this.__dataStorage__[queueName];
        if (_.isNil(q) || _.isEmpty(q)) return false;

        const msg = _.find(q, { 'isRead': false });
        if (_.isNil(msg)) return false;

        // 标记消息已读
        msg.isRead = true;
        return msg;
    }

    // 追加到存储系统
    appendToStorage(queueName, msg, toDisk = true) {
        // 加时间戳
        msg.timeStamp = _.now();
        this.__dataStorage__[queueName].push(msg);

        if (toDisk) {
            const fileName = `${this.mqCachePath}/${queueName}`;
            fs.appendFileSync(fileName, JSON.stringify(msg) + '\r\n');
        }
    }
}

module.exports = FileMQVisitor;