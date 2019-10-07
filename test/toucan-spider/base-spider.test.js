/* eslint-disable no-undef */
const expect = require('chai').expect;
const { ToucanBaseSpider } = require('../../libs/toucan-spider/_base-spider');

describe('base spider 测试 temp', () => {

    describe('爬行循环测试', () => {
        // 测试爬行用得蜘蛛
        class CrawlTestSpider extends ToucanBaseSpider {

            async crawlOnePage(thePage, theTask, submitGatherResult) {

            }
        }

        it('0 层测试', async () => {
            const spider = new CrawlTestSpider();
            const task = await spider.run({ targetUrl: 'i am test', depth: 0 })
            expect(task.totalDonePageCount).to.be.eq(1);
            expect(task.totalErrorPageCount).to.be.eq(0);
        });
    })
})