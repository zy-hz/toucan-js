/* eslint-disable no-undef */
const mqFactory = require('../../libs/toucan-message-queue');
const { SubscribeGatherTaskJob } = require('../../libs/toucan-job');
const expect = require('chai').expect;
const { sleep } = require('../../libs/toucan-utility');

const gatherResultQueue = 'toucan.gather.result.all'

describe('[测试入口] - SubscribeGatherTaskJob', () => {

    const gatherMQ = mqFactory.createGatherMQ('rabbit');
    const taskMQ = mqFactory.createTaskMQ('rabbit');
    const fromQueues = ['test.cm.http'];

    const taskBody = {
        targetUrl: 'www.19lou.com',
        spiderType: 'http',
        depth: 0
    }

    before(async () => {
        await gatherMQ.connect();
        await taskMQ.connect();
        await gatherMQ.mqVisitor.deleteQueue(fromQueues);

        gatherMQ.bindTaskQueue(fromQueues);
    });

    beforeEach(async () => {
        await taskMQ.mqVisitor.deleteQueue(gatherResultQueue);
    })

    after(async () => {
        // 如果不等待直接关闭消息队列，会导致结果提交异常（第一次创建提交结果通道，需要花费一些时间）
        await sleep(1000);
        await gatherMQ.disconnect();
        await taskMQ.disconnect();
    });

    it('zero task', async () => {
        const job = new SubscribeGatherTaskJob({ gatherMQ });
        const result = await job.do();
        expect(result.jobCount).to.be.equal(0);
    });

    it('one task', async () => {
        // 发布一个任务到队列
        await taskMQ.publishTask({ taskBody, taskOptions: { queue: fromQueues[0] } });

        const job = new SubscribeGatherTaskJob({ gatherMQ, stationInfo: { stationName: 'zy-mock', stationNo: 'job test', stationIp: '11.11.22.33' } });
        let result = await job.do();
        expect(result.jobCount).to.be.equal(1);

        // 检查任务完成得参数
        expectTask(result.task);

        // 模拟第二次取任务
        result = await job.do();
        expect(result.jobCount, '再次订阅应该没有消息了').to.be.equal(0);

        // 检查服务器上的消息
        const msg = await taskMQ.subscribeResult(gatherResultQueue);
        expect(msg).to.have.lengthOf(1);

        // 消息队列上对象
        const { station } = msg[0];
        expect(station.stationName).to.be.eq('zy-mock');
        expect(station.stationNo).to.be.eq('job test');
        expect(station.stationIp).to.be.eq('11.11.22.33');
    });

    it('[long]指定url', async () => {
        // 发布一个任务到队列
        const mulitLayerTask = Object.assign(taskBody, {
            targetUrl: '//www.19lou.com/forum-1366-thread-11551570374141117-1-1.html',
            spiderType: 'browser'
        });
        await taskMQ.publishTask({ taskBody: mulitLayerTask, taskOptions: { queue: fromQueues[0] } });

        const job = new SubscribeGatherTaskJob({ gatherMQ });
        let result = await job.do();
        expect(result.jobCount).to.be.equal(1);
    });

    it('[long]多层', async () => {
        // 发布一个任务到队列
        const mulitLayerTask = Object.assign(taskBody, { depth: 0, spiderType: 'browser', turnPageSleep: 2000 });
        await taskMQ.publishTask({ taskBody: mulitLayerTask, taskOptions: { queue: fromQueues[0] } });

        const job = new SubscribeGatherTaskJob({ gatherMQ });
        let result = await job.do();
        expect(result.jobCount).to.be.equal(1);
    });

});

// 验证0层任务
function expectTask(task) {
    // 完成页面为1
    expect(task.taskDonePageCount).to.be.equal(1);
    expect(task.taskErrorPageCount).to.be.equal(0);
    expect(task.extractUrlTotalCount.innerUrl).is.greaterThan(100);
    expect(task.extractUrlErrorCount).to.be.equal(0);

}