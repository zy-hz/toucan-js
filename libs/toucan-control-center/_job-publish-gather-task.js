//
// 发布采集任务的作业
//

const _ = require('lodash');
const spiderFactory = require('../toucan-page-spider');

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
        // 为task添加taskOptions属性
        _.forEach(tasks, (t) => {
            t.taskOptions = this.buildTaskOptions(t);
        });

        // 推送采集任务到采集任务消息队列
        return await this.taskMQ.publishTask(_.cloneDeep(tasks));
    }

    // 构建采集任务发布的选项
    // 该方法针对 rabbitmq,如果有其他接口，需要在做一个类，例如：PublishGatherTaskJob4Kafka
    // 然后在新见类种，重载这个方法
    //
    // RabbitMQ
    // 分析taskBody
    async buildTaskOptions(task) {
        // exchange ,routeKey,options
        const exchange = 'toucan.gather.task';
        const routeKey = spiderFactory.getSpiderId4Target({} || task.taskBody)

        return { exchange, routeKey }
    }
}

module.exports = PublishGatherTaskJob;