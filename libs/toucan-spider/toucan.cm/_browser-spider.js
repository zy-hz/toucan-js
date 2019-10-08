// 
// 浏览器页面蜘蛛
// 

const { ToucanBaseSpider } = require('../_base-spider');
const pageFetchFactory = require('../../toucan-page-fetch');

class ToucanBrowserSpider extends ToucanBaseSpider {
    constructor(option = {}) {
        // 继承基类的创建参数
        super(option);

        // 创建request类型的页面抓手
        this.pageFetch = pageFetchFactory.createFetch({ fetchType: 'webpage' });
    }
}

module.exports = ToucanBrowserSpider;