/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');
const _ = require('lodash');

describe('ToucanGtherMQ 测试 ', () => {
    const fromQueues = ['toucan.cm.http', 'toucan.cm.browse', 'toucan.sp.com.sohu.news', 'toucan.sp.com.sohu'];

    //runTest('rabbit');
    runTest('file');

    function runTest(mqType) {

        describe(`${mqType}类型`, () => {

            it('bindTaskQueue', () => {
                const gatherMQ = mqFactory.createGatherMQ(mqType);
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
                const gatherMQ = mqFactory.createGatherMQ(mqType);
                const taskMQ = mqFactory.createTaskMQ(mqType);
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
                        queue: testQueues[0]
                    }
                };

                const task3 = {
                    taskBody: 'i am third task',
                    taskOptions: {
                        queue: testQueues[1]
                    }
                };

                beforeEach(async () => {
                    await taskMQ.mqVisitor.deleteQueue(testQueues);
                    await taskMQ.publishTask(task1);
                    await taskMQ.publishTask(task2);
                    await taskMQ.publishTask(task3);
                });

                after(async () => {
                    await taskMQ.disconnect();
                    await gatherMQ.disconnect();
                })

                it('subscribe ONE queue', async () => {
                    const qs = _.at(testQueues, 0);
                    gatherMQ.bindTaskQueue(qs);

                    let msg = await gatherMQ.subscribeTask();
                    expect(msg.content.toString()).to.be.eq(task1.taskBody);

                    msg = await gatherMQ.subscribeTask();
                    expect(msg.content.toString()).to.be.eq(task2.taskBody);

                    msg = await gatherMQ.subscribeTask();
                    expect(msg, '队列没有应该任务了').is.false;
                });

                it('subscribe TWO queue ', async () => {
                    gatherMQ.bindTaskQueue(testQueues);

                    let msg = await gatherMQ.subscribeTask();
                    expect(msg.content.toString()).to.be.eq(task1.taskBody);

                    msg = await gatherMQ.subscribeTask();
                    expect(msg.content.toString(), '获取第二个队列的任务').to.be.eq(task3.taskBody);

                    msg = await gatherMQ.subscribeTask();
                    expect(msg.content.toString(), '获取第一个队列的任务').to.be.eq(task2.taskBody);

                    msg = await gatherMQ.subscribeTask();
                    expect(msg, '队列没有应该任务了').is.false;
                });
            });
        });
    }

});