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
            // 采集任务队列,例如：
            // gatherTaskQueue: [{ queueName, srcFilePath: `${process.cwd()}/.sample/ali.1688.detail_s.txt`,urlFormat:'https://detail.1688.com/{$0}.html' }]
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
        _.each(this.gatherTaskQueue, (opt) => {
            const { queueName, srcFilePath, reload = false } = opt;

            // 如果重载，就先删除队列
            if (reload) this.deleteQueue(queueName);
            // 如果有缓存数据，就先从缓存载入数据
            this.initQueue(queueName);

            // 从文件中载入
            const msgs = loadGatherTaskFromFile(srcFilePath, opt);
            // 去重追加
            const newMsgs = _.differenceWith(msgs, this.__dataStorage__[queueName], (x, y) => { return x.content.targetUrl === y.content.targetUrl })
            // 追加到队列
            this.appendToStorage(queueName, newMsgs)
        });
    }

    // 初始化队列
    initQueue(queueName, { aloneFile = false } = {}) {

        // 已经存在队列，就放弃初始化
        if (!_.isNil(this.__dataStorage__[queueName])) return;

        const fileName = this.getQueueCachFile(queueName);
        this.__dataStorage__[queueName] = []
        if (!fs.existsSync(fileName)) return;

        // 读取
        if (aloneFile) {
            // 从目录读取
            this.initQueueFromDir(queueName, fileName);
        } else {
            // 从文件中读取缓存的信息
            this.initQueueFromFile(queueName, fileName)
        }
    }

    initQueueFromDir(queueName, dirName) {

    }

    initQueueFromFile(queueName, fileName) {
        const lines = _.split(fs.readFileSync(fileName, 'utf-8'), '\r\n');
        _.forEach(lines, (x) => {
            try {
                if (!_.isEmpty(x)) {
                    const msg = JSON.parse(x)
                    this.appendToStorage(queueName, msg, { toDisk: false })
                }
            }
            catch (error) {
                console.error('initQueueFromFile 异常', error);
            }
        });
    }



    // 连接到消息服务器
    async connect() {
    }

    // 断开消息服务器
    async disconnect() {
        // 将缓存内容写入文件
        _.forOwn(this.__dataStorage__, (val, key) => {
            const fileName = this.getQueueCachFile(key);
            saveToFile(fileName, val);
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
        // 获取发送的参数
        const {
            queueOptions = {},
            sendOptions = {}
        } = options;

        // 初始化数组
        const queueName = queue || '_toucan_default_queue';
        this.initQueue(queueName, queueOptions)

        // 推入队列
        const msg = buildMessageObject(content, sendOptions);
        this.appendToStorage(queueName, msg, queueOptions);
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
    appendToStorage(queueName, msg, { toDisk = true, aloneFile = false } = {}) {
        // 对象转数组
        let msgArray = _.castArray(msg);

        // 加时间戳
        _.each(msgArray, (x) => { x.timeStamp = _.now() });
        this.__dataStorage__[queueName] = _.concat(this.__dataStorage__[queueName], msgArray);

        if (toDisk) {
            const fileName = this.getQueueCachFile(queueName);
            const saveFunc = aloneFile ? this.saveToDir : this.saveToFile;
            saveFunc(fileName, msgArray);
        }
    }
    saveToDir(dirName, msgArray) {
        if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });

        const fileName = buildTimeStampFileName(dirName);
        saveToFile(fileName, msgArray);
    }
    saveToFile(fileName, msgArray) {
        msgArray = _.map(msgArray, (x) => { return JSON.stringify(x) });
        fs.appendFileSync(fileName, _.join(msgArray, '\r\n') + '\r\n');
    }

    // 缓存队列的文件名
    getQueueCachFile(queueName) {
        return `${this.mqCachePath}/${queueName}`;
    }

}

// 从文件载入任务
function loadGatherTaskFromFile(src, { urlFormat = '', targetName = '', depth = 0 }) {
    if (!fs.existsSync(src)) {
        console.error('[警告]不能载入采集任务，因为文件不存在。', src);
        return [];
    }

    const lines = fs.readFileSync(src, 'utf-8').split('\r\n');
    return _.map(lines, (x) => {
        return buildMessageObject({ targetUrl: applyFormat(x, urlFormat), targetName, depth })
    })
}

// 应用格式
function applyFormat(content, fmt) {
    if (_.isEmpty(fmt)) return content;

    return fmt.replace(/\{\$0\}/img, content);
}

// 保存到文件
function saveToFile(src, msg) {
    msg = _.map(msg, (x) => { return JSON.stringify(x) });
    fs.writeFileSync(src, msg.join('\r\n'));
}

// 构建消息对象
function buildMessageObject(content, { isRead = false } = {}) {
    return { content, isRead };
}

// 根据时间获得文件名
function buildTimeStampFileName(dirName) {
    let tick = _.now();
    let fileName = ''
    do {
        fileName = `${dirName}/${tick}.dat`;
        tick = tick + 1;
    } while (fs.existsSync(fileName));
    return fileName;
}

module.exports = FileMQVisitor;