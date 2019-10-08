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
    const errorInfo = buildErrorInfo(page);
    return taskInfo + '\n' + errorInfo + `\n\n累计失败：${task.taskErrorPageCount}次`;
}

function buildTaskPageDoneSuccess(task, page) {
    const taskInfo = buildTaskPageProcess(task, '采集成功', page);
    return taskInfo;
}

function buildTaskPageProcess(task, msg, { pageLayerIndex, pageSpendTime, pageUrl } = {}) {
    return `任务${task.targetUrl}第${task.taskDonePageCount + task.taskErrorPageCount}页/第${pageLayerIndex + 1}层${msg}，用时${pageSpendTime}毫秒。页面入口 - ${pageUrl}`;
}

function buildErrorInfo({ code, errno, message, stack }) {
    return `${message}. (code:${code} , errno:${errno})\n${stack}`;
}

module.exports = { TaskJob }