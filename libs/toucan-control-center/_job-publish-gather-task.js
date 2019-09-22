
class PublishGatherTaskJob {

    constructor({ taskMQ }) {
        this.taskMQ = taskMQ;
    }

    // 执行作业
    async do(caller = '') {
        // 从任务源头获取任务

        const task = {
            taskId:'111',
            taskType:'gather',
            taskBody:{
                url:'http://www.baidu.com'
            }
        }

        // 推送任务到任务消息队列
        await this.taskMQ.publishTask(task)
    }
}

module.exports = PublishGatherTaskJob;