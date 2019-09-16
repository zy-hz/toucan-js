/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const mqFactory = require('../../libs/toucan-gather-mq');
const RabbitMQExpect = require('../../libs/toucan-utility/_expect-rabbit-mq');

describe('RabbitGatherMQ 测试', () => {

    it('构造测试', () => {
        const gatherMQ = mqFactory.create('rabbit');
        const mqClass = require('../../libs/toucan-gather-mq/_rabbit-gather-mq');

        expect(gatherMQ).to.be.instanceOf(mqClass);
    });

    it('连接测试', async () => {
        const gatherMQ = mqFactory.create('rabbit');
        await gatherMQ.connect();

        // 构建测试器
        const mqExpect = new RabbitMQExpect();
        expect(await mqExpect.isConnected(gatherMQ.conn)).to.be.true;

        // 断开连接
        await gatherMQ.disconnect();
        expect(await mqExpect.isConnected(gatherMQ.conn)).to.be.false;

    });
});
