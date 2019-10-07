/* eslint-disable no-undef */
const expect = require('chai').expect;
const { ToucanBaseSpider } = require('../../libs/toucan-spider/_base-spider');

describe('base spider 测试 temp', () => {

    describe('爬行循环测试', () => {
        // 测试爬行用得蜘蛛
        class CrawlTestSpider extends ToucanBaseSpider {

            async crawlOnePage(theTask, thePage) {
            }
        }

        // 测试爬行异常的蜘蛛
        class CrawlErrorSpider extends ToucanBaseSpider {

            async crawlOnePage(theTask, thePage) {
                throw Error('我错误了');
            }
        }

        it('0 层正常测试', async () => {
            const spider = new CrawlTestSpider({ spiderName: 'mocha蜘蛛', spiderType: 'CrawlTestSpider' });
            const task = await spider.run({ targetUrl: 'i am test', depth: 0 }, async (task, result) => {

            });

            expect(task.taskDonePageCount).to.be.eq(1);
            expect(task.taskErrorPageCount).to.be.eq(0);
        });

        it('0 层异常测试', async () => {
            const spider = new CrawlErrorSpider({ spiderName: '异常蜘蛛', spiderType: 'CrawlTesCrawlErrorSpidertSpider' });
            const task = await spider.run({ targetUrl: 'i am test', depth: 0 }, async (task, result) => {

            });

            expect(task.taskDonePageCount).to.be.eq(0);
            expect(task.taskErrorPageCount).to.be.eq(1);
        });
    })
})