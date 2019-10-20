//
// 饿了么店铺列表蜘蛛
//
// 参考
// https://github.com/Al-assad/Eleme-Spider
// 
// 接口：
// https://h5.ele.me/restapi/shopping/v3/restaurants?latitude=22.533719&longitude=113.936091&keyword=&offset=0&limit=30&extras[]=activities&extras[]=tags&terminal=h5
// 

const { ToucanBaseSpider } = require('../_base-spider');
const pageFetchFactory = require('../../../libs/toucan-page-fetch');
const _ = require('lodash');
const { NullArgumentError } = require('../../../libs/toucan-error');
const { SiteUrlCount, exURL } = require('../../toucan-utility');

const ELM_HOST = 'https://h5.ele.me';
const ELM_API_PATH = '/restapi/shopping/v3/restaurants';

class ElmShopListSpider extends ToucanBaseSpider {
    constructor(options = {}) {
        // 继承基类的创建参数
        super(options);

        const { geoApi } = options
        // 获取地理信息接口
        this.geoApi = geoApi;

        // 创建request类型的页面抓手
        this.pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
    }

    async run(
        // 采集任务的参数
        task,
        // 提交采集的结果
        submitGatherResult
    ) {
        //  设置页面链接
        task = Object.assign(task, { targetUrl: await this.rebuildTargetUrl(task) ,headless:false});
        return await super.run(task, submitGatherResult);
    }

    // 重构任务的url
    async rebuildTargetUrl(task) {
        //return 'https://h5.ele.me/restapi/shopping/v3/restaurants?latitude=22.533719&longitude=113.936091&keyword=&offset=0&limit=30&extras[]=activities&extras[]=tags&terminal=h5';
        const { targetUrl } = task;
        if (_.isNil(targetUrl)) return this.buildQueryUrl(task);

        const pms = _.split(targetUrl, '\t');
        if (pms.length < 4) return targetUrl;

        return this.buildQueryUrl({ address: pms[0], latitude: pms[2], longitude: pms[3] });
    }

    // 构建查询链接
    async  buildQueryUrl({
        // 城市
        city = '',
        // 地址
        address = '',
        // 北纬
        latitude = '',
        // 东经
        longitude = '',
        // 页面开始位置
        startPageIndex = 0 }
    ) {
        if (_.isEmpty(latitude) || _.isEmpty(longitude)) {
            if (_.isNil(this.geoApi)) throw new NullArgumentError('地理信息接口(geoApi)');

            const ok = await this.geoApi.query(address, city);
            if (ok.status === '0') throw Error(`解析地理信息异常(${ok.status})。address:${address} city:${city}`);
            latitude = ok.result.location.lat;
            longitude = ok.result.location.lng;
        }

        const limit = 30;
        const offset = startPageIndex * limit;

        return `${ELM_HOST}${ELM_API_PATH}?latitude=${latitude}&longitude=${longitude}&keyword=&offset=${offset}&limit=${limit}&extras[]=activities&extras[]=tags&terminal=h5`

    }

    // 分析json has_next 根据hasnext 来确定是否需要翻页
    // 
    analyzeSiteUrlCount(pageUrl, content, layerIndex) {
        let urlCount = SiteUrlCount();
        const pageObj = JSON.parse(content);

        if (pageObj.has_next) {
            const nextUrl = buildNextUrl(pageUrl);
            this._targetUrlPool.push(nextUrl, layerIndex + 1)
        }

        return urlCount;
    }

}

// 构建下一页的链接
function buildNextUrl(url) {
    const queryObj = exURL.getQuery(url);
    queryObj.offset = (queryObj.offset - 0) + (queryObj.limit - 0);
    return `${ELM_HOST}${ELM_API_PATH}?${exURL.getQueryString(queryObj)}`;
}



module.exports = ElmShopListSpider;