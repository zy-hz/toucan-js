/* eslint-disable no-undef */
const expect = require('chai').expect;
const GatherTaskCenter = require('../../libs/toucan-control-center/_gather-task-center');

describe('GatherTaskCenter 综合测试 temp', () => {

    describe('基础', () => {

        it('构造', () => {
            const gtc = new GatherTaskCenter();

            expect(gtc).is.not.null;
        });

        it('启动', async () => {
            const gtc = new GatherTaskCenter();

            // 站点处于关闭状态
            expect(gtc.workInfo.unitStatus.isClosed).to.be.true;

            // 站点处于激活状态
            await gtc.start();
            expect(gtc.workInfo.unitStatus.isIdle).to.be.true;

            // 站点处于激活状态
            await gtc.stop();
            expect(gtc.workInfo.unitStatus.isClosed).to.be.true;
        });

    });


});