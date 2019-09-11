/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const uuid = require('uuid/v1');
const sipderFactory = require('../../libs/toucan-page-spider');

describe('http 蜘蛛抓取测试', () => {

    it('http://delve.bodani.cn/ 测试', async () => {
        const spider = sipderFactory.createSpider({ spiderType: 'http' });
        const taskId = uuid();

        spider.do({
            taskUrl: 'http://delve.bodani.cn/',
            taskId,

            // 发生的异常
            onTaskException: (error) => {
                console.log(error);
                expect.fail('不能出现异常');
            },

            // 任务完成
            onTaskDone: (res) => {
                const { task, taskSpider, statusCode, pageCharset } = res;

                expect(task.taskId, 'taskId 需要保持一致').to.be.eq(taskId);
                expect(taskSpider.spiderType, '蜘蛛类型为 http').to.be.eq('http');

                expect(statusCode, '状态码为200').to.be.eq(200);
                expect(pageCharset, '页面编码为 utf-8').to.match(/^utf-8$/im);
            }
        })

    });

});

describe('http 蜘蛛参数测试', () => {

    it('', async () => {
        const spider = sipderFactory.createSpider({ spiderType: 'http' }, { spiderName: '我是一个测试http蜘蛛' });
        expect(spider.spiderName, '蜘蛛名称').to.be.eq('我是一个测试http蜘蛛');
        expect(spider.spiderType, '蜘蛛类型').to.be.eq('http');

    });

});

describe('http 蜘蛛异常测试 temp', () => {

    it('do 异常测试', async () => {
        const spider = sipderFactory.createSpider({ spiderType: 'http' });

        const taskId = uuid();
        spider.do({
            taskId,
            onTaskException: (error) => {

                expect(error.argName).to.be.eq('taskUrl');
                expect(_.isNil(error.task), 'task 对象不能为空').to.be.false;
                expect(error.task.taskId, 'taskId 需要保持一致').to.be.eq(taskId);
            }
        });


    });
});