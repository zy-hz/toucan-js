// 
// FileMQ 的消息队列
//
//

const ToucanMQVisitor = require('./_toucan-mq-visitor');
const fs = require('fs');
const _ = require('lodash');

const DEFAULT_CACHE_PATH = process.cwd() + '/.cache/filemq';

class FileMQVisitor extends ToucanMQVisitor {

    constructor(optioins = {}) {
        super(optioins);

        const {
            // 文件缓存的目录
            mqCachePath = DEFAULT_CACHE_PATH,
            // 采集任务队列
            gatherTaskQueue = []
        } = optioins;

        this.mqCachePath = mqCachePath;
        this.gatherTaskQueue = gatherTaskQueue;

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
        // 载入采集任务队列
        _.each(this.gatherTaskQueue, ({ queueName, srcFilePath }) => {
            // 如果有缓存数据，就先从缓存载入数据
            this.initQueue(queueName);

            // 从文件中载入
            const msgs = loadGatherTaskFromFile(srcFilePath);
            // 去重追加
            const newMsgs = _.differenceWith(msgs, this.__dataStorage__[queueName], (x, y) => { return x.content === y.content })
            // 追加到队列
            this.appendToStorage(queueName, newMsgs)
        });
    }

    // 初始化队列
    initQueue(queueName) {

        // 已经存在队列，就放弃初始化
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
        const msg = buildMessageObject(content);
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
        // 对象转数组
        let msgArray = _.concat([], msg);

        // 加时间戳
        _.each(msgArray, (x) => { x.timeStamp = _.now() });
        this.__dataStorage__[queueName] = _.concat(this.__dataStorage__[queueName], msgArray);

        if (toDisk) {
            const fileName = `${this.mqCachePath}/${queueName}`;
            msgArray = _.map(msgArray, (x) => { return JSON.stringify(x) });
            fs.appendFileSync(fileName, _.join(msgArray, '\r\n'));
        }
    }
}

// 从文件载入任务
function loadGatherTaskFromFile(src) {
    if (!fs.existsSync(src)) return [];

    const lines = fs.readFileSync(src, 'utf-8').split('\r\n');
    return _.map(lines, (x) => { return buildMessageObject(x) })
}

function buildMessageObject(content, isRead = false) {
    return { content, isRead };
}

module.exports = FileMQVisitor;