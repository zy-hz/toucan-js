const { ToucanBaseSpider } = require('../_base-spider');
const PuppeteerPageFetch = require('../../toucan-page-fetch/_puppeteer-fetch');

class MyPageFetch extends PuppeteerPageFetch {

    // 采集1688 页面详情的时候，有一些特殊的操作
    async specialOp(page, options = {}) {
        // 自动滚动到页面的结束
        await this.autoScroll(page);
    }
}

class Ali1688DetailSpider extends ToucanBaseSpider {

    constructor(option = {}) {
        // 继承基类的创建参数
        super(option);

        // 创建request类型的页面抓手
        this.pageFetch = new MyPageFetch();
    }
}


module.exports = Ali1688DetailSpider;