//
// 回收采集结果的作业
//

const { TaskJob } = require('./_base-task-job');
const { NullArgumentError } = require('../toucan-error');
const _ = require('lodash');

class RegainGatherResultJob extends TaskJob {
    constructor({
        // 任务消息队列
        taskMQ,
        // 结果队列
        resultQueue,
    }) {
        super();
        this.taskMQ = taskMQ;
        this.resultQueue = resultQueue;
    }

    // 执行作业（回收采集结果）
    async do() {

        // 从消息队列订阅结果，这个阶段出现的异常，需要抛出
        const msg = await this.taskMQ.subscribeResult({ consumeOptions: { noAck: false } });
        if (msg === false) {
            // 消息队列没有任务
            return { jobCount: 0 };
        }

        console.log(msg);
    }

}

module.exports = { RegainGatherResultJob };