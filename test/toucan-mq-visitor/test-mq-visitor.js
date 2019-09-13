/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');

const mqVisitorFactory = require('../../libs/toucan-mq-visitor');

describe('ToucanMQVisitorFactory 测试 temp',()=>{

    it('create base visitor',()=>{
        const baseMQVisitor = mqVisitorFactory.create();
        expect(_.isNil(baseMQVisitor),'base visitor 构造不能为空').to.be.false;
    })
});