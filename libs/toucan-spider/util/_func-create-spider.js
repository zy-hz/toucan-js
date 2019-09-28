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
    if (pos === 'prefix') className = `_${specialFlag}-spider`;
    if (pos === 'postfix') className = `_spider-${specialFlag}`;

    return require('../toucan.cm/' + className);
}

module.exports = { createSpiderClassBySpiderType, createSpiderClassByTarget, createSpiderClassByUrl };