//
// 采集消息队列

class ToucanGatherMQ {

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

module.exports = ToucanGatherMQ;