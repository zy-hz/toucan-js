/* eslint-disable no-undef */
const mqFactory = require('../../libs/toucan-message-queue');
const { SubscribeGatherTaskJob } = require('../../libs/toucan-job');
const expect = require('chai').expect;

class MyTestJob extends SubscribeGatherTaskJob{

    async onPageDone(task,page){
        console.log(page.pageContent);
    }
}

describe('[long]1688 网站测试', () => {

    const gatherMQ = mqFactory.createGatherMQ('rabbit');
    const taskMQ = mqFactory.createTaskMQ('rabbit');
    const fromQueues = ['test.sp.1688'];

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

    describe('采集产品页', () => {
        const taskBody = {
            targetUrl: 'detail.1688.com/offer/602752160064.html?spm=a260j.12536015.jr601u7p.2.145d700eMEM6by',
            spiderType: 'http',
            depth: 0
        }
        it('',async()=>{
            await taskMQ.publishTask({ taskBody, taskOptions: { queue: fromQueues[0] } });

            const job = new MyTestJob({ gatherMQ });
            let result = await job.do();
            expect(result.jobCount).to.be.equal(1);
    
        })
    })
})