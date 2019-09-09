/* eslint-disable no-undef */
const expect = require('chai').expect;
const ToucanPageSpider = require('../../libs/toucan-page-spider');


describe('page spider 测试', () => {

    it('start and stop 测试 temp', async () => {
        const spider = new ToucanPageSpider();

        spider.start();
        console.log(`${spider.spiderName}运行中...`);
        expect(spider.isRunning,'运行标注为真').to.be.true;

        await spider.stop();
        expect(spider.isRunning,'运行标注为真').to.be.false;

    });

    it('run 循环体测试', async () => {
        const spiderA = new ToucanPageSpider({ spiderName: '1号蜘蛛', idleSleep: 3000 });
        spiderA.start();

        const spiderB = new ToucanPageSpider({ spiderName: '2号蜘蛛' });
        spiderB.start();

    });
});