// 任务作业
const { ToucanJob } = require('./_base-job');

class TaskJob extends ToucanJob {

    // 记录爬行任务完成一个页面的日志
    logTaskPageDone(task, page) {
        this.log(task)
    }
}

module.exports = { TaskJob }