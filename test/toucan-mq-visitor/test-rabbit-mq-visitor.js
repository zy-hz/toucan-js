/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const RabbitMQExpect = require('../../libs/toucan-utility/_expect-rabbit-mq');
const uuid = require('uuid').v4;
const { sleep } = require('../../libs/toucan-utility');

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
            expect(x.content.toString(), '接收消息内对比').to.be.eq(msg);
        }, { queue })
    });

    it('waitMessage', async () => {
        const queue = 'test-waitm';
        const msg = '我是测试 ' + uuid();

        let count = 0
        // 这行函数不能添加await ，会导致阻塞
        mqv.receive((x) => {
            //expect(x.content.toString(), '接收消息内对比').to.be.eq(msg);
            count = count + 1;
        }, { queue })

        await sleep(500);
        await mqv.send(msg, { queue });
        await mqv.send(msg, { queue });
        await mqv.send(msg, { queue });

        await sleep(500);
        expect(count, '3次接收').to.be.eq(3);
    });
})
