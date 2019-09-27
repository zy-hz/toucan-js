//
// 采集消息队列

const ToucanBaseMQ = require('./_toucan-base-mq');
const { sleep } = require('../toucan-utility');

class ToucanGatherMQ extends ToucanBaseMQ {

    constructor(mqVisitor, options = {}) {
        super(mqVisitor, options);
    }

    // 绑定采集任务的队列
    // fromQueues - 订阅的队列列表，例如：toucan.cm.http,toucan.sp.com.ali
    bindTaskQueue(fromQueues = []){

    }

    // 订阅采集任务

    async subscribeTask() {

        await this.mqVisitor.receive(async (msg) => {

            console.log(msg.content.toString());
            await sleep(1000);
            return true;

        }, {
            queue: 'toucan.cm.http'
        })
    }
}



module.exports = ToucanGatherMQ;