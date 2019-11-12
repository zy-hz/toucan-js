/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');
const _ = require('lodash');

describe('[测试入口] - ToucanTaskMQ', () => {

    it('构造', () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        expect(taskMQ).is.not.empty;
    });

    it('连接和断开', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        await taskMQ.connect();

        await taskMQ.disconnect();
    });

    it('subscribeResult', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        const queue = 'test.subscribeResult';
        const content = '我是测试##单单iii ';
        const task1 = {
            taskBody: content,
            taskOptions: {
                queue
            }
        };

        await taskMQ.mqVisitor.deleteQueue(queue);
        await taskMQ.publishTask(task1);

        const msg = await taskMQ.subscribeResult(queue);
        expect(msg).to.be.eqls(_.castArray(content));

        await taskMQ.disconnect()
    })

});