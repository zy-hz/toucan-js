/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');

describe('http 蜘蛛测试', () => {

    it('do 测试', async () => {
        const spider = sipderFactory.createSpider({ spiderType: 'http' }, { spiderName: '我是一个测试http蜘蛛' });
        expect(spider.spiderName,'蜘蛛名称').to.be.eq('我是一个测试http蜘蛛');
        expect(spider.spiderType,'蜘蛛类型').to.be.eq('http');
        
    });

    it('do 异常测试 temp',async()=>{
        const spider = sipderFactory.createSpider({ spiderType: 'http' });

        spider.do({
            onTaskException:(error)=>{
                console.log(error);
                expect(error.paramName).to.be.eq('taskUrl');
            }
        })
    });

});