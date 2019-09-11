const ToucanPageSipder = require('./_base-page-spider');
const pageFetchFactory = require('../toucan-page-fetch');

class ToucanHttpPageSpider extends ToucanPageSipder {

    constructor(option = {}) {
        // 继承基类的创建参数
        super(option);

        // 创建request类型的页面抓手
        this.pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
    }

}

module.exports = ToucanHttpPageSpider;