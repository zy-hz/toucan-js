const { spiderFactory } = require('../toucan-spider');
const { TaskJob } = require('./_base-task-job');
const _ = require('lodash');

class SubscribeGatherTaskJob extends TaskJob {
    constructor({
        gatherMQ,
        spiderOptions,
        stationInfo,
    }) {
        super();
        this.gatherMQ = gatherMQ;
        this.spiderOptions = spiderOptions || {};
        this.stationInfo = stationInfo;
    }

    // 注意：不是自己的异常，必须抛出，例如：gatherMQ的异常
    async do() {

        // 从消息队列订阅任务，这个阶段出现的异常，需要抛出
        let task = await this.gatherMQ.subscribeTask();
        if (task === false) {
            // 消息队列没有任务
            return { jobCount: 0 };
        }

        // 根据任务的类型等参数创建对应的采集蜘蛛
        const spider = spiderFactory.createSpider(task, this.spiderOptions);
        // 启动采集蜘蛛
        task = await spider.run(task, async ({ task, page }) => { this.onPageDone(task, page) });

        // 采集一个任务完成
        await this.onTaskDone(task);

        return { jobCount: 1, task };
    }

    // 采集一个页面结束
    async onPageDone(task, page) {

        // 记录页面日志
        this.logTaskPageDone(task, page);

        // 提交页面采集结果到服务器
        const submitBeginTime = _.now();
        const result = await this.gatherMQ.submitResult(
            { task, page, station: this.stationInfo },
            {
                // 指定结果消息队列
                // 优先采用task中的参数，然后是spiderOptions，最后才是默认
                queue: task.resultQueueName || this.spiderOptions.resultQueueName || 'toucan.gather.result.all',
                options: {
                    queueOptions: {
                        // 每个结果存储一个单独文件，该选项针对fileMQ生效
                        aloneFile: true,
                    },
                    sendOptions: {
                        // 如果需要压缩传输，在这里指定压缩的格式
                        //contentEncoding: 'gizp' 
                    },
                }
            }
        );
        const submitEndTime = _.now();

        this.logResultSubmitDone(task, page, Object.assign(
            result,
            { submitBeginTime, submitEndTime, submitSpendTime: submitEndTime - submitBeginTime })
        );
    }

    // 采集任务完成
    async onTaskDone(task) {
        // 记录页面日志
        this.logGatherTaskDone(task);

        // TODO::提交到服务器-表示任务完成
    }
}

module.exports = { SubscribeGatherTaskJob };