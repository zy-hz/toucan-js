/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqFactory = require('../../libs/toucan-message-queue');


describe('ToucanGatherMQ 测试 temp', () => {
    const fromQueues = ['toucan.cm.http', 'toucan.cm.browse', 'toucan.sp.com.sohu.news', 'toucan.sp.com.sohu'];
    it('bindTaskQueue ', () => {
        const gatherMQ = mqFactory.createGatherMQ('rabbit');
        gatherMQ.bindTaskQueue(fromQueues);

        let queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.http');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.browse');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.sp.com.sohu.news');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.sp.com.sohu');

        queue = gatherMQ.popTaskQueue();
        expect(queue).to.be.eq('toucan.cm.http');
    });


});