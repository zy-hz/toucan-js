/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');

const mqVisitorFactory = require('../../libs/toucan-mq-visitor');

describe('ToucanMQVisitorFactory 测试', () => {

    it('create base visitor', () => {
        const option = { op1: 1, op2: 'abc' };
        const baseMQVisitor = mqVisitorFactory.create(option);

        expect(_.isNil(baseMQVisitor), 'base visitor 构造不能为空').to.be.false;
        expect(baseMQVisitor.option, 'base visitor option ').to.be.deep.eq(option);
    });

    it('crate rabbitmq visitor',()=>{
        const option = { op1: 1, op2: 'abc' };
        const rabbitMQVisitor = mqVisitorFactory.create('rabbit',option);

        expect(_.isNil(rabbitMQVisitor), 'rabbit visitor 构造不能为空').to.be.false;
        expect(rabbitMQVisitor.option, 'rabbit visitor option ').to.be.deep.eq(option);
    });
});