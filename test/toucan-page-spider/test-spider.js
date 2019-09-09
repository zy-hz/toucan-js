/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');

describe('page spider 基础功能测试 temp', () => {

    it('spider factory create 测试', () => {
        const opt = {spiderName : '我是测试蜘蛛',idleSleep :231};
        const spider = sipderFactory.createSpider(opt);

        expect(spider.spiderName).to.be.eq(opt.spiderName);
        expect(spider.idleSleep).to.be.eq(opt.idleSleep);
    });
});