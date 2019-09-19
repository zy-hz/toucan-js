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

describe('RabbitMQVisitor queue模式', () => {
    const mqv = mqvCreate('rabbit');

    before(async () => {
        await mqv.connect();
    });

    after(async () => {
        await mqv.disconnect();
    })

    it('', async () => {
        const queue = 'test-send2q';
        const msg = '我是测试 ' + uuid();
        let result = await mqv.send(msg, { queue });

        expect(result).to.be.true;

        await mqv.receive((x) => {
            expect(x.content.toString(), '接收消息内对比').to.be.eq(msg);
        }, { queue })
    });

})

describe('RabbitMQVisitor direct模式', () => {
    const mqv = mqvCreate('rabbit');

    before(async () => {
        await mqv.connect();
    });

    after(async () => {
        await mqv.disconnect();
    })

    it('prepareExchange temp', async () => {
        const exchange = 'testEx-direct-810';
        const routeKeys = ['q1','q2','q3'];

        await mqv.prepareExchange(exchange, 'direct', routeKeys, options = { durable: true })
    });

    it('direct', async () => {
        const exchange = 'testEx-direct';
        const msg = '我是测试 ' + uuid();
        let result = await mqv.send(msg, { exchange, routeKey: 'abc' });

        expect(result).to.be.true;

    });

})