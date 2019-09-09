/* eslint-disable no-unused-vars */
const ToucanPageSpider = require('./_base-page-spider');

// 大嘴鸟的蜘蛛工厂
class ToucanSpiderFactory {

    // 创造蜘蛛
    createSpider({
        // 触发获取任务的回掉
        onGetTask,
        // 蜘蛛的名称         
        spiderName,
        // 空闲的时候，暂停的时间
        idleSleep
    } = {}) {

        const opt = Object.assign(arguments[0], {});
        return new ToucanPageSpider(opt);
    }
}

module.exports = new ToucanSpiderFactory();