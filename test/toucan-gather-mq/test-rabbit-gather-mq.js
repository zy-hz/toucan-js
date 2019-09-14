/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const mqFactory = require('../../libs/toucan-gather-mq');

describe('RabbitGatherMQ 测试 temp', () => {

    it('构造测试', () => {
        const gatherMQ = mqFactory.create('rabbit');
        const mqClass = require('../../libs/toucan-gather-mq/_rabbit-gather-mq');

        expect(gatherMQ).to.be.instanceOf(mqClass);
    });

    it('连接测试', async () => {
        const gatherMQ = mqFactory.create('rabbit');

        await gatherMQ.connect();
        expect(_.isNil(gatherMQ.conn)).to.be.false;
    });
});
