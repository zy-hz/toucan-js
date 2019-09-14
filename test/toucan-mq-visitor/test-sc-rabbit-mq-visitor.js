/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const mqVisitorFactory = require('../../libs/toucan-mq-visitor');
const amqb = require('amqplib');

// 测试器
class RabbitMQCheck {

    async init() {
        this.conn = await amqb.connect();
        this.ch = await this.conn.createChannel();
    }

    async getQueueMessageCount(queueName) {
        const {messageCount} = await this.ch.assertQueue(queueName)
        return messageCount || 0;
    }

    async dispose(){
        await this.ch.close();
        await this.conn.close();
    }
}

describe('短连接 RabbitMQ 测试', () => {

    it('构造测试', (done) => {
        const mqVisitor = mqVisitorFactory.create('rabbit-sc');
        expect(_.isNil(mqVisitor), '构造RabbitMQ对象不能为空').to.be.false;

        done();
    })
});

describe('短连接 RabbitMQ publish 功能测试', () => {

    const mqVisitor = mqVisitorFactory.create('rabbit-sc');

    it('发生消息测试 temp', async () => {
        const mqChecker = await createRabbitMQChecker();

        const queueName = 'test-publish-msm';
        const beginMessageCount = await mqChecker.getQueueMessageCount(queueName);

        await mqVisitor.publish('my first message', queueName);
        let endMessageCount = await mqChecker.getQueueMessageCount(queueName);
        expect(endMessageCount - beginMessageCount, '增加了一个消息').to.be.eq(1);

        await mqChecker.dispose()
    });
});

async function createRabbitMQChecker() {
    const checker = new RabbitMQCheck();
    await checker.init();

    return checker;
}