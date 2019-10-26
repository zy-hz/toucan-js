/* eslint-disable no-undef */
const expect = require('chai').expect;
const { GatherTaskCenter } = require('../../../libs/toucan-control-center');
const { sleep } = require('../../../libs/toucan-utility');
const path = require('path');

describe('[测试入口] - GatherTaskCenter', () => {

    describe('基础', () => {
        const cfgFileName = path.resolve(__dirname, 'gather-task-config.json');

        it('构造', () => {
            const gtc = new GatherTaskCenter();

            expect(gtc).is.not.null;
        });

        it('[long]启动', async () => {
            const gtc = new GatherTaskCenter(cfgFileName);

            // 站点处于关闭状态
            expect(gtc.workInfo.unitStatus.isClosed).to.be.true;

            // 站点处于激活状态
            // 初始化后自动启动
            await gtc.init();
            expect(gtc.workInfo.unitStatus.isIdle).to.be.true;

            // 等待
            await sleep(11000);

            // 站点处于激活状态
            await gtc.stop();
            expect(gtc.workInfo.unitStatus.isClosed).to.be.true;
        });

    });

});
