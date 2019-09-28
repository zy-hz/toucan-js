const ToucanHttpPageSpider = require('./_http-page-spider');
const _ = require('lodash');
const { isClass } = require('../toucan-utility');

const { getSpiderIdBySpiderType, getSpiderIdByTargetName, getSpiderIdByTargetUrl } = require('./util');

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
        spiderOption = {}
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
        if (!isClass(spiderClass, baseSpiderClassName)) spiderClass = ToucanHttpPageSpider;

        const opt = Object.assign(spiderOption, { spiderType });
        return new spiderClass(opt);
    }

    // 活动蜘蛛编号为采集目标
    getSpiderId({
        // 第一优先：蜘蛛的类型，http - http协议蜘蛛, browser - 浏览器蜘蛛
        spiderType = '',
        // 第二优先：任务目标，例如：ali,ali-1688,jd
        targetName = '',
        // 第三优先：任务的链接
        targetUrl = '',
    } = {}) {
        let spiderId = getSpiderIdBySpiderType(spiderType);
        if (!_.isEmpty(spiderId)) return spiderId;

        spiderId = getSpiderIdByTargetName(targetName);
        if (!_.isEmpty(spiderId)) return spiderId;

        spiderId = getSpiderIdByTargetUrl(targetUrl);
        if (!_.isEmpty(spiderId)) return spiderId;

        // 默认使用http蜘蛛
        return getSpiderIdBySpiderType('http');
    }
}

// 根据蜘蛛的类型创建蜘蛛
function createSpiderClassBySpiderType(spiderType) {
    return loadSpiderClass(spiderType, 'prefix');
}

// 根据目标创建蜘蛛
function createSpiderClassByTarget(targetName) {
    return require('./_base-spider');
}

function createSpiderClassByUrl(url) {
    return require('./_base-spider');
}

// 载入蜘蛛类
function loadSpiderClass(
    specialFlag,
    // 标记所在的位置 prefix - 前置，postfix - 后置
    pos = 'both'
) {
    let className = '';
    if (pos === 'prefix') className = `_${specialFlag}-page-spider`;
    if (pos === 'postfix') className = `_page-spider-${specialFlag}`;

    return require('./' + className);
}


module.exports = { spiderFactory: new ToucanSpiderFactory() };