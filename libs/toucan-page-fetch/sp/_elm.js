// 
// 饿了么页面抓手
//
const ToucanPageFetch = require('../_base-fetch');
const _ = require('lodash');
const browser = require('../../toucan-browser');
const { ELM_H5_HOST } = require('../_web-const');
const { analyzePageStage, PAGE_STAGE_FOOD_ENTRY, PAGE_STAGE_SHOP_LIST } = require('./_elm-page-anlayze');
const { sleep } = require('../../../libs/toucan-utility');

class ElmPageFetch extends ToucanPageFetch {
    constructor() {
        super();
        this.fetchType = 'webpage';
        this.fetchName = '饿了么浏览器';

        this.homePage = `https://${ELM_H5_HOST}`;
    }

    async close(){
        await browser.close();
    }

    //
    // 准备饿了么浏览器，
    // 在开始所有动作前，必须调用该方法
    async prepare(options = {}) {
        let pageContent;
        // 检查状态
        if (await browser.isReady4Fetch()) {
            // 获得页面的内容
            this.log(`${this.fetchName}准备完毕`);
            pageContent = await browser.getPageContent();
        }
        else {
            // 初始化浏览器
            this.log(`准备${this.fetchName}...`);
            await browser.init(options);

            // 设置收货地址
            this.log(`设置当前收货地址`)
            await browser.setGeolocation(this.homePage, options);

            // 转向饿了么首页,有两种结果
            // 1. 需要登录
            // 2. 已经登录
            this.log(`导航->${this.homePage}...`)
            const result = await browser.go(this.homePage, { waitForTime: 1200, waitForText: 'a:登录', waitForFlag: `section[class='shop-0']` });
            pageContent = _.isNil(result) ? '' : result.pageContent;
        }

        // 分析页面，确定页面的阶段
        this.log(`分析响应页面所处的阶段...`);
        const pageStage = analyzePageStage(pageContent);
        this.log(`当前页面阶段为 - ${pageStage}`);

        // 如果阶段是食物类名列表，则表示准备采集成功
        return {
            ok: pageStage === PAGE_STAGE_FOOD_ENTRY,
            pageStage,
            pageContent
        };
    }

    // 一直准备，直到成功
    async prepareWaitSuccess(options = {}) {
        let spanSecond = 0;
        do {
            const result = await this.prepare(options);
            if (result.ok) return result;
            await sleep(3000);
            spanSecond = spanSecond + 3;
        } while (spanSecond < 3600);

        return { ok: false }
    }

    // 转到店铺列表页面
    async goToPageStage(expectStage) {
        do {
            const pageContent = await browser.getPageContent();
            const curStage = analyzePageStage(pageContent);
            if (curStage === expectStage) return;
            await browser.back({ waitUntil: 'networkidle2' });
        } while (true)
    }

    // 抓取指定连接的内容
    async doFoodEntry(id, options = {}) {
        this.log(`点击->${id}`);
        return await browser.click(id, options);
    }

    // 转向店铺首页
    // 注意：开始点击前需要保证当前页面是店铺列表页面，且店铺class在页面中存在
    async doShopHome(id, options = {}) {
        // 转到店铺列表页面
        await this.goToPageStage(PAGE_STAGE_SHOP_LIST);

        // 添加
        id = `section[class='${id}']`;

        this.log(`点击->${id}`);
        return await browser.click(id, Object.assign(options, { watiForFlag: '#shoptab', scrollCount: 3 }));
    }

}

module.exports = ElmPageFetch;