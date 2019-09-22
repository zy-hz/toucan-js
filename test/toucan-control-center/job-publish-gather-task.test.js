/* eslint-disable no-undef */
const expect = require('chai').expect;
const PublishTaskJob = require('../../libs/toucan-control-center/_job-publish-gather-task');
const mqFactory = require('../../libs/toucan-message-queue');

describe('PublishTaskJob 综合测试 temp', () => {

    describe('do', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        const job = new PublishTaskJob({ taskMQ });

        after(async () => {
            await taskMQ.disconnect();
        });

        it('',async()=>{
            await job.do('test');
        });
    });
});