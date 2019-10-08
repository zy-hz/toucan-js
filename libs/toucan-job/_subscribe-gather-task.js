const { spiderFactory } = require('../toucan-spider');
const { TaskJob } = require('./_base-task-job');

class SubscribeGatherTaskJob extends TaskJob {
    constructor({
        gatherMQ
    }) {
        super();
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
        let task = JSON.parse(msg.content.toString());
        // 根据任务的类型等参数创建对应的采集蜘蛛
        const spider = spiderFactory.createSpider(task);
        // 启动采集蜘蛛
        task = await spider.run(task, async ({ task, page }) => { this.onPageDone(task, page) });

        return { jobCount: 1, task };
    }

    // 采集一个页面结束
    async onPageDone(task, page) {
        
        // 纪录页面日志
        this.logTaskPageDone(task,page);

        // 提交结果到服务器
    }
}

module.exports = { SubscribeGatherTaskJob };