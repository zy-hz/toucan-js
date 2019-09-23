//
// 发布采集任务的作业
//

class PublishGatherTaskJob {

    constructor({ taskMQ, taskV }) {
        this.taskMQ = taskMQ;
        this.taskV = taskV;
    }

    // 执行作业（发布采集任务）
    async do(options = {}) {

        // 从任务源头获取采集任务
        const tasks = await this.taskV.readTaskSync(options);

        // 从任务构建发布采集任务的选项

        // 推送采集任务到采集任务消息队列
        return await this.taskMQ.publishTask(tasks)
    }
}

module.exports = PublishGatherTaskJob;