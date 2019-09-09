/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');

describe('page spider 基础功能测试 temp', () => {

    it('spider factory create 测试', () => {
        const spiderOption = { spiderName: '我是测试蜘蛛', idleSleep: 231 };
        const spider = sipderFactory.createSpider({}, spiderOption);

        expect(spider.spiderName).to.be.eq(spiderOption.spiderName);
        expect(spider.idleSleep).to.be.eq(spiderOption.idleSleep);
    });
});