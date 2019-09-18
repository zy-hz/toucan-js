/* eslint-disable no-undef */
const expect = require('chai').expect;
const GatherTaskCenter = require('../../libs/toucan-control-center/_gather-task-center');

describe('GatherTaskCenter 启动测试', () => {

    it('构造 temp', () => {
        const gtc = new GatherTaskCenter();

        expect(gtc).is.not.null;
    });

    it('启动', async () => {

    });
});