//
// 发布采集任务的作业
//

class PublishGatherTaskJob {

    constructor({ taskMQ }) {
        this.taskMQ = taskMQ;
    }

    // 执行作业（发布采集任务）
    async do(caller = '') {
 
        // 从任务源头获取采集任务

        // 从任务构建发布采集任务的选项

        // 推送采集任务到采集任务消息队列
        await this.taskMQ.publishTask(task)
    }
}

module.exports = PublishGatherTaskJob;