const ToucanHttpSpider = require('./toucan.cm/_http-spider');
const _ = require('lodash');
const { isClass } = require('../toucan-utility');

const { getSpiderIdBySpiderType, getSpiderIdByTargetName, getSpiderIdByTargetUrl } = require('./util/_func-spider-id');
const { createSpiderClassBySpiderType, createSpiderClassByTarget, createSpiderClassByUrl } = require('./util/_func-create-spider');

// 大嘴鸟的蜘蛛工厂
class ToucanSpiderFactory {

    // 创造蜘蛛
    createSpider(
        // 任务选项
        {
            // 第一优先：蜘蛛的类型，http - http协议蜘蛛, browser - 浏览器蜘蛛
            spiderType = '',
            // 第二优先：任务目标，例如：ali,ali-1688,jd
            targetName = '',
            // 第三优先：任务的链接
            targetUrl = '',

        } = {},
        // 蜘蛛的参数
        spiderOptions = {}
    ) {
        // 蜘蛛基类的名称
        const baseSpiderClassName = 'ToucanBaseSpider';
        let spiderClass = {};

        // 根据类型创造蜘蛛
        if (!_.isEmpty(spiderType)) spiderClass = createSpiderClassBySpiderType(spiderType);

        // 根据任务目标的类型创建蜘蛛
        if (!isClass(spiderClass, baseSpiderClassName) && !_.isEmpty(targetName)) spiderClass = createSpiderClassByTarget(targetName);

        // 根据任务的url创建蜘蛛
        if (!isClass(spiderClass, baseSpiderClassName) && !_.isEmpty(targetUrl)) spiderClass = createSpiderClassByUrl(targetUrl);

        // 如果都不是，创建默认蜘蛛 (http蜘蛛)
        if (!isClass(spiderClass, baseSpiderClassName)) spiderClass = ToucanHttpSpider;

        const opt = Object.assign(spiderOptions, { spiderType: spiderType || 'special' });
        return new spiderClass(opt);
    }

    // 根据采集目标获得蜘蛛标识
    // 例如：toucan.cm.http,toucan.sp.com.ali.1688
    getSpiderId({
        // 第一优先：蜘蛛的类型，http - http协议蜘蛛, browser - 浏览器蜘蛛
        spiderType = '',
        // 第二优先：任务目标，例如：ali,ali-1688,jd
        targetName = '',
        // 第三优先：任务的链接
        targetUrl = '',
    } = {}) {
        // 根据类型获得蜘蛛标识
        let spiderId = getSpiderIdBySpiderType(spiderType);
        if (!_.isEmpty(spiderId)) return spiderId;

        // 根据任务目标的类型获得蜘蛛标识
        spiderId = getSpiderIdByTargetName(targetName);
        if (!_.isEmpty(spiderId)) return spiderId;

        // 根据任务的url获得蜘蛛标识
        spiderId = getSpiderIdByTargetUrl(targetUrl);
        if (!_.isEmpty(spiderId)) return spiderId;

        // 默认使用http蜘蛛
        return getSpiderIdBySpiderType('http');
    }
}

module.exports = { spiderFactory: new ToucanSpiderFactory() };