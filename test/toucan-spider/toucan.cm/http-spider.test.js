/* eslint-disable no-undef */
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const { spiderFactory } = require('../../../libs/toucan-spider');

describe('http sipder', () => {

    describe('[long]http 蜘蛛抓取测试 ', () => {

        it('http://delve.bodani.cn/ 测试', async () => {
            const spider = spiderFactory.createSpider({ spiderType: 'http' });
            const taskId = uuid();

            const task = await spider.run({
                targetUrl: 'http://delve.bodani.cn/',
                taskId
            }, ({ task, page }) => {

                const { statusCode, pageCharset } = page;
                expect(statusCode, '状态码为200').to.be.eq(200);
                expect(pageCharset, '页面编码为 utf-8').to.match(/^utf-8$/im);
            })

            expect(task.taskId, 'taskId 需要保持一致').to.be.eq(taskId);

        });

    });

    describe('http 蜘蛛参数测试 ', () => {

        it('', async () => {
            const spider = spiderFactory.createSpider({ spiderType: 'http' }, { spiderName: '我是一个测试http蜘蛛' });
            expect(spider.spiderName, '蜘蛛名称').to.be.eq('我是一个测试http蜘蛛');
            expect(spider.spiderType, '蜘蛛类型').to.be.eq('http');

        });

    });

});