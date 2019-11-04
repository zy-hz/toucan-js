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

    }

}

module.exports = { RegainGatherResultJob };