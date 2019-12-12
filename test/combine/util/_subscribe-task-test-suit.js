/* eslint-disable no-undef */
// 订阅采集任务测试
const { SubscribeGatherTaskJob } = require('../../../libs/toucan-job');
const mqFactory = require('../../../libs/toucan-message-queue');
const { sleep } = require('../../../libs/toucan-utility');
const expect = require('chai').expect;
const _ = require('lodash');

function subscribeTaskTest(suitInfo, { mq, resultQueueName, gatherStationInfo, batchOptions = {} } = {}) {
    const { suitName } = suitInfo;
    // 用户指定了专门的结果队列
    resultQueueName = batchOptions.resultQueueName || resultQueueName;

    // 构建采集消息队列
    const gatherMQ = mqFactory.createGatherMQ(mq.mqType, mq.options);
    // 蜘蛛参数 ,
    // 如果没有在batchOptions中指定结果队列，蜘蛛参数使用测试中指定的结果队列
    // 如果有在batchOptions中指定结果队列，就不用指定蜘蛛参数（任务中讲会设置结果队列）
    const spiderOptions = _.isEmpty(batchOptions) ? { resultQueueName } : {};

    // 消息队列访问器
    const mqv = require('../../../libs/toucan-mq-visitor')(mq.mqType, mq.options);

    describe(`[${suitName}] - 运行采集作业`, function () {
        const runner = new SubscribeGatherTaskJob({ gatherMQ, spiderOptions, stationInfo: gatherStationInfo });

        before('准备测试环境', async () => {
            // 设置采集任务的队列
            gatherMQ.bindTaskQueue(mq.queueName);
            // 清除结果队列
            await mqv.deleteQueue(resultQueueName);
        })

        it('subscribe测试', async () => {
            const result = await runner.do();
            expect(result.jobCount).eq(1);
        })

        it('检查结果队列', async function () {
            this.retries(5);
            await sleep(1000);
            const msg = await mqv.read({ queue: resultQueueName, consumeOptions: { noAck: false } });
            expect(_.isObject(msg)).is.true;
        })

        after('清理测试环境', async () => {
            await gatherMQ.disconnect();
            await mqv.disconnect();
        })
    })
}

module.exports = { subscribeTaskTest }