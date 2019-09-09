/* eslint-disable no-undef */
const ToucanPageSpider = require('../../libs/toucan-page-spider');

describe('page spider 测试', () => {

    it('start and stop 测试 temp',async()=>{
        const spider = new ToucanPageSpider({ idleSleep:3000 });
        spider.start();
        console.log(`${spider.spiderName}运行中...`);

        spider.stop();
    });

    it('run 循环体测试',  async () => {
        const spiderA = new ToucanPageSpider({ spiderName: '1号蜘蛛',idleSleep:3000 });
        spiderA.start();

        const spiderB = new ToucanPageSpider({ spiderName: '2号蜘蛛' });
        spiderB.start();

    });
});