//
// 采集消息队列

const ToucanBaseMQ = require('./_toucan-base-mq');
const { sleep } = require('../toucan-utility');

class ToucanGatherMQ extends ToucanBaseMQ {

    constructor(mqVisitor, options = {}) {
        super(mqVisitor, options);
    }

    // 订阅采集任务
    async subscribeTask(options = {}) {

        await this.mqVisitor.receive(async (msg) => {

            console.log(msg.content.toString());
            await sleep(1000);

        }, {
            queue: 'toucan.cm.http',
            options: {
                consumeOptions: { noAck: false }
            }
        })
    }
}



module.exports = ToucanGatherMQ;