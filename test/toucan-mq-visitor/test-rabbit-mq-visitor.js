/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const RabbitMQExpect = require('../../libs/toucan-utility/_expect-rabbit-mq');
const uuid = require('uuid').v4;

describe('RabbitMQVisitor 基础测试', () => {

    it('连接断开', async () => {
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

describe('RabbitMQVisitor 发送接收 temp', () => {
    const mqv = mqvCreate('rabbit');

    before(async () => {
        await mqv.connect();
    });

    after(async () => {
        await mqv.disconnect();
    })

    it('sendToQueue', async () => {
        const queue = 'test-send2q';
        const msg = '我是测试 ' + uuid();
        let result = await mqv.send(msg, { queue });
        
        expect(result).to.be.true;

        await mqv.receive((x) => {
            expect(x.content.toString).to.be.eq(msg);
        }, { queue })
    })
})
