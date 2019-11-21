//
// Toucan消息队列的基类

const { NullArgumentError } = require('../toucan-error');
const _ = require('lodash');

class ToucanBaseMQ {

    constructor(mqVisitor, option = {}) {
        this.mqVisitor = mqVisitor;
    }

    async connect() {
        await this.mqVisitor.connect();
    }

    async disconnect() {
        await this.mqVisitor.disconnect();
    }

    async send() {

    }

    async onReceived() {

    }

    // 提取信息
    extractMessage(msg) {

        if (_.isNil(msg)) throw new NullArgumentError('msg');
        if (_.isNil(msg.content)) throw new NullArgumentError('msg.content');

        const content = _.isBuffer(msg.content) ? msg.content.toString() : msg.content;
        if (_.isString(content)) {
            try {
                return JSON.parse(content);
            }
            catch (error) {
                return content;
            }
        }
        return content
    }
}

module.exports = ToucanBaseMQ;