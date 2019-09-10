/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');
const { isClass } = require('../../libs/toucan-utility');

describe('page spider 基础功能测试', () => {

    it('spider factory create 蜘蛛参数测试', () => {
        const spiderOption = { spiderName: '我是测试蜘蛛', idleSleep: 231 };
        const spider = sipderFactory.createSpider({}, spiderOption);

        expect(spider.spiderName).to.be.eq(spiderOption.spiderName);
        expect(spider.idleSleep).to.be.eq(spiderOption.idleSleep);
    });

    it('create spider for spider type 测试', () => {

        let spider = sipderFactory.createSpider({ spiderType: 'http' });
        spiderComponeExpect(spider,'http','ToucanHttpPageSpider');

        spider = sipderFactory.createSpider({ spiderType: 'browser' });
        spiderComponeExpect(spider,'browser','ToucanBrowserPageSpider');


    });
});

function spiderComponeExpect(spider, spiderType, className) {

    expect(spider.spiderType, `应该是 ${spiderType} 蜘蛛`).to.be.eq(spiderType);
    expect(isClass(spider.constructor, className), `蜘蛛类是 ${className}`).to.be.true;
    expect(isClass(spider.constructor, 'ToucanPageSpider'), '基础类是 ToucanPageSpider').to.be.true;

}