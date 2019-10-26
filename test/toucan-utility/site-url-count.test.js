/* eslint-disable no-undef */
const expect = require('chai').expect;
const { SiteUrlCount } = require('../../libs/toucan-utility');

describe('[测试入口] - site url count', () => {
    it('基础', () => {
        const cnt = SiteUrlCount();
        cnt.innerUrl = 1;
        cnt.outerUrl = 2;
        cnt.scriptUrl = 3;

        expect(cnt.innerUrl).to.be.eq(1);
    });

    it('初始化 ', () => {
        const cnt = SiteUrlCount();
        expect(cnt.innerUrl).to.be.eq(0);
    });

    it('构造', () => {
        const cnt = SiteUrlCount({innerUrl:20});
        expect(cnt.innerUrl).to.be.eq(20);
    })

    it('add',()=>{
        const cnt1 = SiteUrlCount({innerUrl:20});
        const cnt2 = cnt1.add({innerUrl:10});
        expect(cnt2.innerUrl).to.be.eq(30);
    })
})