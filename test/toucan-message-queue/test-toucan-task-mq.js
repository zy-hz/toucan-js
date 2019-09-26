/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');

describe('ToucanTaskMQ 测试', () => {

    it('构造', () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        expect(taskMQ).is.not.empty;
    });

    it('连接和断开', async () => {
        const taskMQ = mqFactory.createTaskMQ('rabbit');
        await taskMQ.connect();

        await taskMQ.disconnect();
    });

});