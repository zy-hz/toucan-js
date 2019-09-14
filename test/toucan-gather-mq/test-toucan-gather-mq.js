/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const mqFactory = require('../../libs/toucan-gather-mq');

describe('ToucanGatherMQ 测试', () => {

    it('默认构造测试', () => {
        const gatherMQ = mqFactory.create();
        const ToucanGatherMQ = require('../../libs/toucan-gather-mq/_toucan-gather-mq');

        expect(gatherMQ).to.be.instanceOf(ToucanGatherMQ);
    });

});