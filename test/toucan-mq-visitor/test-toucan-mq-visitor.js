/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');

const ToucanMQVisitor = require('../../libs/toucan-mq-visitor/_toucan-mq-visitor');
const RabbitMQVisitor = require('../../libs/toucan-mq-visitor/_rabbit-mq-visitor');

describe('ToucanMQVisitor 测试', () => {

    it('默认构造', () => {
        const mqVisitor = mqvCreate();
        expect(mqVisitor).to.be.instanceOf(ToucanMQVisitor);
    });

    it('RabbitMQ构造', () => {
        const mqVisitor = mqvCreate('rabbit');
        expect(mqVisitor).to.be.instanceOf(RabbitMQVisitor);
    });
});