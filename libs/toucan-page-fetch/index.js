const SuperAgentPageFetch = require('./_superagent-fetch');
const PuppeteerPageFetch = require('./_puppeteer-fetch');

// 页面抓手
class ToucanPageFetch {

    // 构造
    constructor() {

    }

    // 从指定的链接中获得页面
    async do(url, option = {}) {

        // 如果抓手不存在,根据参数创建抓手
        this._fetcher = this._fetcher || createPageFetchObject(Object.assign(option, { url }));
        return await this._fetcher.do(url, option)
    }

}

// 创建页面抓手对象
function createPageFetchObject({
    // 页面链接
    url = '',
    // 抓手类型: request - request请求,webpage - 页面访问
    fetchType = 'request'
} = {}) {

    console.log('create page fetch:', url, fetchType)
    return fetchType === 'webpage' ? new PuppeteerPageFetch() : new SuperAgentPageFetch();
}

module.exports = ToucanPageFetch;