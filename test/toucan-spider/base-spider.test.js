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

        // 测试爬行多层蜘蛛
        class CrawlMulitLayerSpider extends ToucanBaseSpider {

            async crawlOnePage(theTask, thePage) {

                this.__count__ = this.__count__ + 1 || 1;
                console.log('多层', this.__count__);
                if (this.__count__ < 5) {
                    this._targetUrlPool.push('testUrl' + this.__count__, this.__count__);
                }
            }
        }


        it('0 层正常测试', async () => {
            const spider = new CrawlTestSpider({ spiderName: 'mocha蜘蛛', spiderType: 'CrawlTestSpider' });
            const task = await spider.run({ targetUrl: 'i am test', depth: 0 }, async (task, page) => {
                expect(page.pageSpendTime).is.greaterThan(0);
            });

            expect(task.taskDonePageCount).to.be.eq(1);
            expect(task.taskErrorPageCount).to.be.eq(0);
            expect(task.taskSpendTime).is.greaterThan(0);
        });

        it('0 层异常测试', async () => {
            const spider = new CrawlErrorSpider({ spiderName: '异常蜘蛛', spiderType: 'CrawlTesCrawlErrorSpidertSpider' });
            const task = await spider.run({ targetUrl: 'i am test', depth: 0 }, async (task, result) => {

            });

            expect(task.taskDonePageCount).to.be.eq(0);
            expect(task.taskErrorPageCount).to.be.eq(1);
        });

        it('多层测试', async () => {
            const spider = new CrawlMulitLayerSpider({ spiderName: '多层蜘蛛', spiderType: 'CrawlMulitLayerSpider' });
            const task = await spider.run({ targetUrl: '多层', depth: 10 }, async (task, page) => {
                expect(page.pageSpendTime).is.greaterThan(0);
            });

            expect(task.taskDonePageCount).to.be.eq(5);
            expect(task.taskErrorPageCount).to.be.eq(0);
            expect(task.taskSpendTime).is.greaterThan(0);
        })
    })
})