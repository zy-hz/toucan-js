/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const RabbitMQExpect = require('../../libs/toucan-utility/_expect-rabbit-mq');

describe('RabbitMQVisitor 测试', () => {

    it('连接测试', async () => {
        const mqv = mqvCreate('rabbit');
        await mqv.connect();

        // 构建测试器
        const mqExpect = new RabbitMQExpect();
        expect(await mqExpect.isConnected(mqv.conn)).to.be.true;

        // 断开连接
        await mqv.disconnect();
        expect(await mqExpect.isConnected(mqv.conn)).to.be.false;

    });
});
