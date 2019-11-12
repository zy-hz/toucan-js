/* eslint-disable no-undef */
const expect = require('chai').expect;
const { spiderFactory } = require('../../libs/toucan-spider');
const { isClass } = require('../../libs/toucan-utility');

describe('[测试入口] - ToucanSpiderFactory', () => {

    describe('create', () => {
        it('蜘蛛参数测试', () => {
            const spiderOption = { spiderName: '我是测试蜘蛛', idleSleep: 231 };
            const spider = spiderFactory.createSpider({}, spiderOption);

            expect(spider.spiderName).to.be.eq(spiderOption.spiderName);
            expect(spider.idleSleep).to.be.eq(spiderOption.idleSleep);
        });

        it('spiderType 测试 ', () => {

            let spider = spiderFactory.createSpider({ spiderType: 'http' });
            spiderComponeExpect(spider, 'http', 'ToucanHttpSpider');

            spider = spiderFactory.createSpider({ spiderType: 'browser' });
            spiderComponeExpect(spider, 'browser', 'ToucanBrowserSpider');

        });

        it('targetName 测试',()=>{
            let spider = spiderFactory.createSpider({ targetName: 'com-1688-detail' });
            spiderComponeExpect(spider, 'special', 'Ali1688DetailSpider');
        });
    })

    describe('getSpiderId ', () => {

        it('sipderType ', () => {
            expect(spiderFactory.getSpiderId({ spiderType: 'http' })).to.be.eq('toucan.cm.http');
            expect(spiderFactory.getSpiderId({ spiderType: 'browser' })).to.be.eq('toucan.cm.browser');
            expect(spiderFactory.getSpiderId(), '类型为空，默认http蜘蛛').to.be.eq('toucan.cm.http');
        });

        it('targetName', () => {
            expect(spiderFactory.getSpiderId({ targetName: 'ali-1688-detail' })).to.be.eq('toucan.sp.ali.1688.detail');
        });

        it('targetUrl ', () => {
            expect(spiderFactory.getSpiderId({ targetUrl: 'www.sohu.com' })).to.be.eq('toucan.sp.com.sohu');
            expect(spiderFactory.getSpiderId({ targetUrl: 'news.sohu.com' })).to.be.eq('toucan.sp.com.sohu.news');
            expect(spiderFactory.getSpiderId({ targetUrl: 'ad.sohu.com' })).to.be.eq('toucan.sp.com.sohu');

            expect(spiderFactory.getSpiderId({ targetUrl: 'abc.com' })).to.be.eq('toucan.cm.http');
        });


    });
});

function spiderComponeExpect(spider, spiderType, className) {

    expect(spider.spiderType, `应该是 ${spiderType} 蜘蛛`).to.be.eq(spiderType);
    expect(isClass(spider.constructor, className), `蜘蛛类是 ${className}`).to.be.true;
    expect(isClass(spider.constructor, 'ToucanBaseSpider'), '基础类是 ToucanBaseSpider').to.be.true;

}