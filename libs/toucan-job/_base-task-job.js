// 任务作业
const { ToucanJob } = require('./_base-job');

class TaskJob extends ToucanJob {

    // 记录爬行任务完成一个页面的日志
    logTaskPageDone(task, page) {
        if (page.hasException) {
            const msg = buildTaskPageDoneError(task, page);
            this.warn(msg);
        }
        else {
            const msg = buildTaskPageDoneSuccess(task, page);
            this.log(msg);
        }
    }
}

function buildTaskPageDoneError(task, page) {
    const taskInfo = buildTaskPageProcess(task, '采集失败', page);
    return taskInfo;
}

function buildTaskPageDoneSuccess(task, page) {
    const taskInfo = buildTaskPageProcess(task, '采集成功', page);
    return taskInfo;
}

function buildTaskPageProcess(task, msg, { pageLayerIndex, pageSpendTime } = {}) {
    return `任务${task.targetUrl}第${task.taskDonePageCount + task.taskErrorPageCount}页/第${pageLayerIndex + 1}层${msg}，用时${pageSpendTime}毫秒`;
}

module.exports = { TaskJob }