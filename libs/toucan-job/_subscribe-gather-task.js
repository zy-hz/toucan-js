const {spiderFactory} = require('../toucan-spider');

class SubscribeGatherTaskJob {
    constructor({
        gatherMQ
    }) {
        this.gatherMQ = gatherMQ;
    }

    // 注意：不是自己的异常，必须抛出，例如：gatherMQ的异常
    async do() {

        // 从消息队列订阅任务，这个阶段出现的异常，需要抛出
        const msg = await this.gatherMQ.subscribeTask();
        if (msg === false) {
            // 消息队列没有任务
            return { jobCount: 0 };
        }

        // 获得采集任务
        const task = JSON.parse(msg.content.toString());
        const spider = spiderFactory.createSpider(task);

        return { jobCount: 1 };
    }
}

module.exports = { SubscribeGatherTaskJob };