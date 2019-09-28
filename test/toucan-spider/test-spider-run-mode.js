/* eslint-disable no-undef */
const expect = require('chai').expect;
const { spiderFactory } = require('../../libs/toucan-spider');

describe('page spider run mode 测试', () => {

    it('start and stop 测试', async () => {
        const spider = spiderFactory.createSpider();

        spider.start();
        console.log(`${spider.spiderName}运行中...`);
        expect(spider.isRunning, '运行标识为真').to.be.true;

        await spider.stop();
        expect(spider.isRunning, '运行标识为假').to.be.false;

    });

});