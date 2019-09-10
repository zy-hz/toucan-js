const ToucanPageSpider = require('./_base-page-spider');
const _ = require('lodash');

// 大嘴鸟的蜘蛛工厂
class ToucanSpiderFactory {

    // 创造蜘蛛
    createSpider(
        // 任务选项
        {
            // 第一优先：蜘蛛的类型，http - http协议蜘蛛, browser - 浏览器蜘蛛
            spiderType = '',
            // 第二优先：任务目标，例如：ali,ali-1688,jd
            taskTarget = '',
            // 第三优先：任务的链接
            taskUrl = '',

        },
        // 蜘蛛的参数
        spiderOption = {}
    ) {

        let spiderClass = {};

        if (!_.isEmpty(spiderType)) spiderClass = createSpiderClassBySpiderType(spiderType);

        console.log(spiderClass.constructor )

        if (_.isObject(spiderClass) && !_.isEmpty(taskTarget)) spiderClass = createSpiderClassByTarget(taskTarget);

        if (_.isObject(spiderClass) && !_.isEmpty(taskUrl)) spiderClass = createSpiderClassByUrl(taskUrl);

        if(_.isObject(spiderClass)) spiderClass = ToucanPageSpider;

        const opt = Object.assign(spiderOption, { spiderType });
        return new spiderClass(opt);
    }
}

// 根据蜘蛛的类型创建蜘蛛
function createSpiderClassBySpiderType(spiderType) {
    return require('./_base-page-spider');
}

// 根据目标创建蜘蛛
function createSpiderClassByTarget(targetName) {
    return require('./_base-page-spider');
}

function createSpiderClassByUrl(url) {
    return require('./_base-page-spider');
}

module.exports = new ToucanSpiderFactory();