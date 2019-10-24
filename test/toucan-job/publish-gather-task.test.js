/* eslint-disable no-undef */
const expect = require('chai').expect;
const { PublishGatherTaskJob } = require('../../libs/toucan-job');
const mqFactory = require('../../libs/toucan-message-queue');
const tvFactory = require('../../libs/toucan-task-visitor');

describe('[测试入口] - PublishGatherTaskJob', () => {

    describe('do', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        const taskV = tvFactory.create();
        const job = new PublishGatherTaskJob({ taskMQ, taskV, exchange: 'test.toucan.gather.task' });

        after(async () => {
            await taskMQ.disconnect();
        });

        it('one task', async () => {
            const result = await job.do({ caller: 'test' });
            resultExpect(result, false, 1);

        });

        it('two task', async () => {
            const result = await job.do({ caller: 'test', maxCount: 2 });
            resultExpect(result, false, 2);
        });

        it('zero task', async () => {
            const result = await job.do({ caller: 'test', maxCount: 0 });
            resultExpect(result, false, 0);
        });
    });
});

// 结果检查
function resultExpect(result, hasException, taskCount) {
    if (result.hasException) {
        expect(result.error).is.instanceOf(Error);
        console.log(result.error);
    }

    expect(result.hasException, '没有异常').to.be.eq(hasException);
    expect(result.taskCount, `${taskCount}个任务`).to.be.eq(taskCount);


}