/* eslint-disable no-undef */
const ToucanPageSpider = require('../../libs/toucan-page-spider');

describe('page spider 测试', () => {

    it('run 循环体测试 temp', async () => {
        const spiderA = new ToucanPageSpider({ spiderName: '1号蜘蛛',idleSleep:3000 });
        spiderA.run();

        const spiderB = new ToucanPageSpider({ spiderName: '2号蜘蛛' });
        spiderB.run();

    });
});