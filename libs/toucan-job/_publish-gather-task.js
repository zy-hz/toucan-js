//
// 发布采集任务的作业
//

const _ = require('lodash');
const { spiderFactory } = require('../toucan-spider');
const { TaskJob } = require('./_base-task-job');

class PublishGatherTaskJob extends TaskJob {

    constructor({ taskMQ, taskV, exchange }) {
        super();

        this.taskMQ = taskMQ;
        this.taskV = taskV;

        // 指定交换机
        // 用于rabbitmq
        this.exchange = exchange;
    }

    // 执行作业（发布采集任务）
    async do(options = {}) {

        // 从任务源头获取采集任务
        const tasks = await this.taskV.readTaskSync(options);
        this.log(`发布${tasks.length}个采集任务...`);

        // 从任务构建发布采集任务的选项
        // 为task添加taskOptions属性
        for (const t of tasks) {
            t.taskOptions = await this.buildTaskOptions(t);
        }

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
        const routeKey = spiderFactory.getSpiderId(task.taskBody)
        // 准备exchange
        await this.taskMQ.mqVisitor.prepareExchange(this.exchange, 'direct', { durable: true });
        return { exchange: this.exchange, routeKey }
    }

    log(msg) {
        super.log(`[PublishGatherTaskJob] ${msg}`);
    }
}

module.exports = { PublishGatherTaskJob };