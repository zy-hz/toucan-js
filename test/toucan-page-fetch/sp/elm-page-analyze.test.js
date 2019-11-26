/* eslint-disable no-undef */
const {
    analyzePageStage,
    PAGE_STAGE_ASK_LOGIN,
    PAGE_STAGE_FOOD_ENTRY,
    PAGE_STAGE_SHOP_LIST,
    analyzeShopListPage,
    analyzeShopHomePage
} = require('../../../libs/toucan-page-fetch/sp/_elm-page-anlayze');

const fs = require('fs');
const expect = require('chai').expect;

describe('[测试入口] - elm 页面分析测试 ', () => {

    describe('analyzePageStatus ', () => {
        const pageContentLogon = fs.readFileSync(`${__dirname}/sample/elm-site-has-logon.html`, 'utf-8');
        const pageContentLogin = fs.readFileSync(`${__dirname}/sample/elm-site-ask-login.html`, 'utf-8');
        const pageContentShopList = fs.readFileSync(`${__dirname}/sample/elm-food-shop-list.html`, 'utf-8');

        it('has logon', () => {
            const stage = analyzePageStage(pageContentLogon);
            expect(stage, 'PAGE_STAGE_FOOD_ENTRY').to.be.eq(PAGE_STAGE_FOOD_ENTRY)
        })

        it('ask login', () => {
            const stage = analyzePageStage(pageContentLogin);
            expect(stage, 'PAGE_STAGE_ASK_LOGIN').to.be.eq(PAGE_STAGE_ASK_LOGIN)
        })

        it('isShopList',()=>{
            const stage = analyzePageStage(pageContentShopList);
            expect(stage, 'PAGE_STAGE_SHOP_LIST').to.be.eq(PAGE_STAGE_SHOP_LIST)
        })
    })

    describe('analyzeShopListPage', () => {
        it('', () => {
            const pageContent = fs.readFileSync(`${__dirname}/sample/elm-food-shop-list.html`, 'utf-8');
            const result = analyzeShopListPage(pageContent);
            const { shops } = result;
            expect(shops, '共有8个店铺').have.lengthOf(8);
            expect(shops[0].shopClass).to.be.eq('index-container_10L_lQb shop-0')
            expect(shops[7].shopClass).to.be.eq('index-container_10L_lQb shop-7')
        })
    })

    describe('analyzeShopHomePage', () => {
        it('0', () => {
            const pageContent = fs.readFileSync(`${__dirname}/sample/elm-shop-home.html`, 'utf-8');
            const result = analyzeShopHomePage(pageContent);
            const { shopTabs ,shopInfo,products} = result;
            expect(shopTabs,'共有3个标签').have.length(3);
            expect(shopTabs[0].tabName).to.be.eq('点餐');
            expect(shopTabs[2].tabName).to.be.eq('商家');

            expect(shopInfo.shopName).to.be.eq('姜汁鸡(滨和店)');
            expect(shopInfo.shopScore).to.be.eq('评价4.8');
            expect(shopInfo.shopAddress).to.be.eq('浙江省杭州市滨江区长河街道江二社区滨和路1652-100号');
            expect(shopInfo.sellMonthly).to.be.eq('月售4558单');

            expect(products).have.length(33);
        })

        it('1', () => {
            const pageContent = fs.readFileSync(`${__dirname}/sample/elm-shop-home-1.html`, 'utf-8');
            const result = analyzeShopHomePage(pageContent);
            const { shopTabs ,shopInfo,products} = result;
            expect(shopTabs,'共有3个标签').have.length(3);
            expect(shopTabs[0].tabName).to.be.eq('点餐');
            expect(shopTabs[2].tabName).to.be.eq('商家');

            expect(shopInfo.shopName).to.be.eq('苏鲜牛杂黄焖鸡米饭');
            expect(shopInfo.shopScore).to.be.eq('评价4.3');
            expect(shopInfo.shopAddress).to.be.eq('杭州市滨江区西兴街道滨康二苑75号商铺');
            expect(shopInfo.sellMonthly).to.be.eq('月售9187单');

            expect(products).have.length(35);
        })
    })
})