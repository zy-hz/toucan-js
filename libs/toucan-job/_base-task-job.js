// 任务作业
const { ToucanJob } = require('./_base-job');
const _ = require('lodash');

class TaskJob extends ToucanJob {

    // 记录爬行任务完成一个页面的日志
    logTaskPageDone(task, page) {
        if (page.hasException) {
            const msg = buildTaskPageDoneError(task, page);
            this.error(msg);
        }
        else {
            const msg = buildTaskPageDoneSuccess(task, page);
            this.log(msg);
        }
    }

    // 记录任务完成得日志
    logGatherTaskDone(task) {
        if (task.hasException) {
            const msg = buildGatherTaskMessage(task, '采集失败');
            this.error(msg, task);
        }
        else {
            const msg = buildGatherTaskMessage(task, '采集成功');
            this.log(msg);
        }

        function buildGatherTaskMessage(task, msg) {
            return `任务${task.targetUrl}${msg}，用时${Math.ceil(task.taskSpendTime / 1000)}秒。`
        }
    }

    // 记录提交结果到服务器成功
    logResultSubmitDone(task, page, result) {
        if (result.hasException) {
            const msg = buildResultSubmitProcess(task, page, result, '提交采集结果失败');
            this.error(msg, result.error);
        } else {
            const msg = buildResultSubmitProcess(task, page, result, '提交采集结果成功');
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

function buildTaskPageProcess(task, msg, { pageLayerIndex, pageSpendTime, pageUrl, urlCountInPage = {} } = {}) {
    const totalSpend = Math.ceil(task.taskSpendTime / 1000) + '秒';
    const urlCountInfo = buildUrlCountInfo(urlCountInPage);
    const depthInfo = `${pageLayerIndex}/${task.depth}`;
    return `任务${task.targetUrl}第${task.taskDonePageCount + task.taskErrorPageCount}页/共${task.taskPlanPageCount}页${msg}，本页用时${pageSpendTime}毫秒/累计用时${totalSpend}。页面入口 - ${pageUrl} (${urlCountInfo})。采集深度：${depthInfo}`;
}

function buildErrorInfo({ code, errno, message, stack }) {
    return `${message}. (code:${code} , errno:${errno})\n${stack}`;
}

function buildUrlCountInfo({ innerUrl = 0, outerUrl = 0, scriptUrl = 0 } = {}) {
    return `内链：${innerUrl}个，外链：${outerUrl}个，动链：${scriptUrl}个`;
}

function buildResultSubmitProcess(task, page, result, msg) {
    return `任务${task.targetUrl}第${task.taskDonePageCount + task.taskErrorPageCount}页/共${task.taskPlanPageCount}页${msg}，用时${result.submitSpendTime}ms。`
}

module.exports = { TaskJob }