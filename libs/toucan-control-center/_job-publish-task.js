
class PublishTaskJob {

    constructor({ taskMQ }) {
        this.taskMQ = taskMQ;
    }

    // 执行作业
    async do(caller = '') {

    }
}

module.exports = PublishTaskJob;