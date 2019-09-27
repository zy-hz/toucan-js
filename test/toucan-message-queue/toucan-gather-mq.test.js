/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');


describe('ToucanGatherMQ 测试', () => {

    it('bindTaskQueue temp', () => {
        const gatherMQ = mqFactory.createGatherMQ('rabbit');
        gatherMQ.bindTaskQueue()
    });


});