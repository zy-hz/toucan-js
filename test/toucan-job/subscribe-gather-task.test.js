/* eslint-disable no-undef */
const mqFactory = require('../../libs/toucan-message-queue');
const { SubscribeGatherTaskJob } = require('../../libs/toucan-job');
const expect = require('chai').expect;

describe('SubscribeGatherTaskJob 测试 ', () => {

    const gatherMQ = mqFactory.createGatherMQ('rabbit');
    const taskMQ = mqFactory.createTaskMQ('rabbit');
    const fromQueues = ['test.cm.http'];

    const taskBody = {
        targetUrl: 'www.sina.com',
        spiderType: 'http',
        depth: 1
    }

    before(async () => {
        await gatherMQ.connect();
        await taskMQ.connect();
        await gatherMQ.mqVisitor.deleteQueue(fromQueues);

        gatherMQ.bindTaskQueue(fromQueues);
    });

    after(async () => {
        await gatherMQ.disconnect();
        await taskMQ.disconnect();
    });

    it('zero task', async () => {
        const job = new SubscribeGatherTaskJob({ gatherMQ });
        const result = await job.do();
        expect(result.jobCount).to.be.equal(0);
    });

    it('one task temp', async () => {
        // 发布一个任务到队列
        await taskMQ.publishTask({ taskBody, taskOptions: { queue: fromQueues[0] } });

        const job = new SubscribeGatherTaskJob({ gatherMQ });
        let result = await job.do();
        expect(result.jobCount).to.be.equal(1);

        result = await job.do();
        expect(result.jobCount, '再次订阅应该没有消息了').to.be.equal(0);
    });

});