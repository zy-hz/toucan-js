const { ToucanBaseSpider } = require('../_base-spider');
const PuppeteerPageFetch = require('../../toucan-page-fetch/_puppeteer-fetch');

class MobilePageFetch extends PuppeteerPageFetch {

    // 采集1688 页面详情的时候，有一些特殊的操作
    async specialOp(page, options = {}) {
        // 自动滚动到页面的结束
        await this.autoScroll(page);
    }
}

class PCPageFetch extends PuppeteerPageFetch {

    // PC端采集1688 页面详情的时候，有一些特殊的操作
    async specialOp(page, options = {}) {
        // 自动滚动到页面的结束
        await this.autoScroll(page);
    }
}

class Ali1688DetailSpider extends ToucanBaseSpider {

    constructor(option = {}) {
        // 继承基类的创建参数
        super(option);
    }

    async run(
        // 采集任务的参数
        task,
        // 提交采集的结果
        submitGatherResult) {

        const { useMobile = false } = task;

        // 当使用移动端模式时，修改目标地址
        // 访问的链接，例如：https://detail.1688.com/offer/xxxx60064.html
        if (useMobile) {
            this.pageFetch = new MobilePageFetch();
            task.targetUrl = task.targetUrl.replace(/detail\.1688\.com/img, "m.1688.com");
        }
        else {
            this.pageFetch = new PCPageFetch();
        }

        return await super.run(task, submitGatherResult);
    }
}


module.exports = Ali1688DetailSpider;