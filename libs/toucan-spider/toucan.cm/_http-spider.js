const { ToucanBaseSpider } = require('../_base-spider');
const pageFetchFactory = require('../../toucan-page-fetch');
const _ = require('lodash');

class ToucanHttpSpider extends ToucanBaseSpider {

    constructor(option = {}) {
        // 继承基类的创建参数
        super(_.assign(option, { spiderName: 'httpSipder' }));

        // 创建request类型的页面抓手
        this.pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
    }

}

module.exports = ToucanHttpSpider;