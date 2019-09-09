/* eslint-disable no-undef */
const expect = require('chai').expect;
const ToucanPageSpider = require('../../libs/toucan-page-spider');


describe('page spider run mode 测试', () => {

    it('start and stop 测试', async () => {
        const spider = new ToucanPageSpider();

        spider.start();
        console.log(`${spider.spiderName}运行中...`);
        expect(spider.isRunning,'运行标注为真').to.be.true;

        await spider.stop();
        expect(spider.isRunning,'运行标注为真').to.be.false;

    });

});