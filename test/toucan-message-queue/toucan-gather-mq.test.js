/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');
const _ = require('lodash');


describe('ToucanGatherMQ 测试 ', () => {
    const fromQueues = ['toucan.cm.http', 'toucan.cm.browse', 'toucan.sp.com.sohu.news', 'toucan.sp.com.sohu'];

    it('bindTaskQueue ', () => {
        const gatherMQ = mqFactory.createGatherMQ('rabbit');
        gatherMQ.bindTaskQueue(fromQueues);

        let queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.http');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.browse');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.sp.com.sohu.news');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.sp.com.sohu');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.http');
    });

    describe('subscribeTask temp', () => {
        const gatherMQ = mqFactory.createGatherMQ('rabbit');
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        const testQueues = ['test.cm.http', 'test.sp.com.sohu'];

        const task1 = {
            taskBody: 'i am first task',
            taskOptions: {
                queue: testQueues[0]
            }
        };

        const task2 = {
            taskBody: 'i am second task',
            taskOptions: {
                queue: testQueues[1]
            }
        };

        before(async () => {
            await taskMQ.mqVisitor.deleteQueue(testQueues);
            await taskMQ.publishTask(task1);
            await taskMQ.publishTask(task2);
        });

        after(async()=>{
            await taskMQ.disconnect();
            await gatherMQ.disconnect();
        })

        it('subscribe ONE queue ', async () => {
            // 读取一个队列
            const qs = _.at(testQueues, 0);
            gatherMQ.bindTaskQueue(qs);

            const msg = await gatherMQ.subscribeTask();
            expect(msg.content.toString()).to.be.eq(task1.taskBody);
        });
    });
});