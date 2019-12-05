/* eslint-disable no-undef */
const expect = require('chai').expect;
const { spiderFactory } = require('../../../libs/toucan-spider');

describe('http sipder', () => {

    describe('http 蜘蛛参数测试 ', () => {

        it('', async () => {
            const spider = spiderFactory.createSpider({ spiderType: 'http' }, { spiderName: '我是一个测试http蜘蛛' });
            expect(spider.spiderName, '蜘蛛名称').to.be.eq('我是一个测试http蜘蛛');
            expect(spider.spiderType, '蜘蛛类型').to.be.eq('http');

        });

    });

});