/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const RabbitMQExpect = require('../../libs/toucan-utility/_expect-rabbit-mq');
const uuid = require('uuid').v4;

describe('RabbitMQVisitor 综合测试', () => {

    describe('基础', () => {

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

    describe('queue收发_删除', () => {
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

            let count = 0;
            await mqv.receive((x) => {
                expect(x.content.toString(), '接收消息内对比').to.be.eq(msg);
                count = 1;
            }, { queue })
            expect(count).to.be.eq(1);

            await mqv.deleteQueue(queue);
        });

    });

    describe('exchange创建删除', () => {
        const mqv = mqvCreate('rabbit');

        before(async () => {
            await mqv.connect();
        });

        after(async () => {
            await mqv.disconnect();
        })

        it('prepareExchange', async () => {
            const exchange = 'testEx-direct-810';

            const ok = await mqv.prepareExchange(exchange, 'direct', options = { durable: true });
            expect(ok.exchange).to.be.eq(exchange);

            await mqv.deleteExchange(exchange);
        });
    });

    describe('direct模式_收发 ', () => {
        const mqv = mqvCreate('rabbit');
        const exchange = 'testEx-direct-send';

        before(async () => {
            await mqv.connect();
            await mqv.prepareExchange(exchange, 'direct');
        });

        after(async () => {
            await mqv.deleteExchange(exchange);
            await mqv.disconnect();
        })

        it('routekey = queue', async () => {
            const msg = '我是测试 ' + uuid();

            const routeKey = 'test-direct-01';
            let result = await mqv.send(msg, { exchange, routeKey });
            expect(result).to.be.true;

            let count = 0;
            await mqv.receive((x) => {
                expect(x.content.toString(), '接收消息内对比').to.be.eq(msg);
                count = 1;
            }, { queue: routeKey })

            expect(count, '消息没有收到').to.be.eq(1);
            await mqv.deleteQueue(routeKey);
        });

    })
});




