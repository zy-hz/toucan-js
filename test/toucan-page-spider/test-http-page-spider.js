/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');

describe('http 蜘蛛测试', () => {

    it('do 测试', async () => {
        const spider = sipderFactory.createSpider({ spiderType: 'http' }, { spiderName: '我是一个测试http蜘蛛' });
        expect(spider.spiderName,'蜘蛛名称').to.be.eq('我是一个测试http蜘蛛');
        
        spider.do()
    });

});