//
// Toucan消息队列的基类

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
}

module.exports = ToucanBaseMQ;