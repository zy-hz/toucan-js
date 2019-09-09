const ToucanPageSpider = require('./_base-page-spider');

// 大嘴鸟的蜘蛛工厂
class ToucanSpiderFactory {

    // 创造蜘蛛
    createSpider(option = {}) {
        return new ToucanPageSpider(option);
    }
}

module.exports = new ToucanSpiderFactory();