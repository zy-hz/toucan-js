const SuperAgentPageFetch = require('./_superagent-fetch');
const PuppeteerPageFetch = require('./_puppeteer-fetch');

// 页面抓手工厂
class ToucanPageFetchFactory {

    // 创建抓手
    createFetch({
        // 页面链接
        url,
        // 抓手类型: request - request请求,webpage - 页面访问
        fetchType = 'request'
    } = {}) {

        return fetchType === 'webpage' ? new PuppeteerPageFetch() : new SuperAgentPageFetch();
    }
}

module.exports = new ToucanPageFetchFactory();