/* eslint-disable no-undef */
const expect = require('chai').expect;
const PublishTaskJob = require('../../libs/toucan-control-center/_job-publish-gather-task');
const mqFactory = require('../../libs/toucan-message-queue');
const tvFactory = require('../../libs/toucan-task-visitor');

describe('PublishTaskJob 综合测试 temp', () => {

    describe('do', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        const taskV = tvFactory.create('fake');
        const job = new PublishTaskJob({ taskMQ, taskV });

        after(async () => {
            await taskMQ.disconnect();
        });

        it('one task', async () => {
            const result = await job.do({ caller: 'test' });
            expect(result.hasException, '没有异常').to.be.false;
            expect(result.taskCount, '1个任务').to.be.eq(1);
        });


        it('two task', async () => {
            const result = await job.do({ caller: 'test', maxCount: 2 });
            expect(result.hasException, '没有异常').to.be.false;
            expect(result.taskCount, '2个任务').to.be.eq(2);
        });

        it('zero task', async () => {
            const result = await job.do({ caller: 'test', maxCount: 0 });
            expect(result.hasException, '没有异常').to.be.false;
            expect(result.taskCount, '0个任务').to.be.eq(0);
        });
    });
});