/* eslint-disable no-undef */
const mqFactory = require('../../libs/toucan-message-queue');
const expect = require('chai').expect;
const _ = require('lodash');

describe('[测试入口] - toucan result mq', () => {

    describe('subscribeResult 测试', () => {
        const gatherResultQueue = 'toucan.gather.result.all';
        const resultMQ = mqFactory.createResultMQ('rabbit', {
            // 设置连接的方法
        });

        before('', async () => {
            await resultMQ.bindResultQueue(gatherResultQueue);
        })

        after('',async()=>{
            await resultMQ.disconnect();
        })

        it('', async () => {
            const consumeOptions = {
                // 当指定noAck = true ,这样消费消息后，就从服务器上删除
                noAck: false,
                // 同时等待ack确认信息的数量为1
                waitAckNumber: 1
            }
            const result = await resultMQ.subscribeResult({ consumeOptions });
            expect(_.isBoolean(result), '不是逻辑类型').false;
        })
    })

})