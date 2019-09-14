/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const mqVisitorFactory = require('../../libs/toucan-mq-visitor');


describe('短连接 RabbitMQ 测试', () => {

    it('构造测试 temp', (done) => {
        const mqVisitor = mqVisitorFactory.create('rabbit-sc');
        expect(_.isNil(mqVisitor), '构造RabbitMQ对象不能为空').to.be.false;

        done();
    })

    it('消息生产者测试', () => {
        const rabbitMQVisitor = mqVisitorFactory.create('rabbit');

        rabbitMQVisitor.sendQueueMsg('testQueue', 'my first message', (error) => {
            console.log(error)
        })
    });

    it('消息消费者测试', () => {
        const rabbitMQVisitor = mqVisitorFactory.create('rabbit');
        rabbitMQVisitor.receiveQueueMsg('testQueue', (msg) => {
            console.log(msg)
        })
    });
})