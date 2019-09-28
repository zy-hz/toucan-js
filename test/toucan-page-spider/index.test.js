/* eslint-disable no-undef */
const expect = require('chai').expect;
const sipderFactory = require('../../libs/toucan-page-spider');
const { isClass } = require('../../libs/toucan-utility');

describe('ToucanSpiderFactory 测试', () => {

    describe('create', () => {
        it('蜘蛛参数测试', () => {
            const spiderOption = { spiderName: '我是测试蜘蛛', idleSleep: 231 };
            const spider = sipderFactory.createSpider({}, spiderOption);

            expect(spider.spiderName).to.be.eq(spiderOption.spiderName);
            expect(spider.idleSleep).to.be.eq(spiderOption.idleSleep);
        });

        it('spider type 测试', () => {

            let spider = sipderFactory.createSpider({ spiderType: 'http' });
            spiderComponeExpect(spider, 'http', 'ToucanHttpPageSpider');

            spider = sipderFactory.createSpider({ spiderType: 'browser' });
            spiderComponeExpect(spider, 'browser', 'ToucanBrowserPageSpider');

        });
    })

    describe('getSpiderId ', () => {

        it('sipderType ', () => {
            expect(sipderFactory.getSpiderId({ spiderType: 'http' })).to.be.eq('toucan.cm.http');
            expect(sipderFactory.getSpiderId({ spiderType: 'browser' })).to.be.eq('toucan.cm.browser');
            expect(sipderFactory.getSpiderId(),'类型为空，默认http蜘蛛').to.be.eq('toucan.cm.http');
        });

        it('targetUrl', () => {
            expect(sipderFactory.getSpiderId({ targetUrl: 'www.sohu.com' })).to.be.eq('toucan.sp.com.sohu');
            expect(sipderFactory.getSpiderId({ targetUrl: 'news.sohu.com' })).to.be.eq('toucan.sp.com.sohu.news');
            expect(sipderFactory.getSpiderId({ targetUrl: 'ad.sohu.com' })).to.be.eq('toucan.sp.com.sohu');

            expect(sipderFactory.getSpiderId({ targetUrl: 'abc.com' })).to.be.eq('toucan.cm.http');
        });


    });
});

function spiderComponeExpect(spider, spiderType, className) {

    expect(spider.spiderType, `应该是 ${spiderType} 蜘蛛`).to.be.eq(spiderType);
    expect(isClass(spider.constructor, className), `蜘蛛类是 ${className}`).to.be.true;
    expect(isClass(spider.constructor, 'ToucanPageSpider'), '基础类是 ToucanPageSpider').to.be.true;

}