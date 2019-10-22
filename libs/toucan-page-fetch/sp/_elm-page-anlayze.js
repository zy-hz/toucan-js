//
// 饿了么页面分析器
//
const _ = require('lodash');
const cheerio = require('cheerio');
// 未知
const PAGE_STAGE_UNDEFINED = 'undefined';
// 食品入口阶段
const PAGE_STAGE_FOOD_ENTRY = '食物类名入口';
// 要求登录
const PAGE_STAGE_ASK_LOGIN = '要求用户登录';
// 店铺列表阶段
const PAGE_STAGE_SHOP_LIST = '店铺列表';

// 分析页面所处的阶段
function analyzePageStage(pageContent) {

    // 构架页面解析对象
    const $ = cheerio.load(pageContent);

    if (isAskLogin($)) return PAGE_STAGE_ASK_LOGIN;
    if (isFoodEntry($)) return PAGE_STAGE_FOOD_ENTRY;
    if (isShopList($)) return PAGE_STAGE_SHOP_LIST;

    return PAGE_STAGE_UNDEFINED;
}

// 是否登录信息
function isAskLogin($) {
    const node = $(`p:contains(登录后查看更多商家)`);
    return node.length > 0;
}

// 是否为食品入口页面
function isFoodEntry($) {
    const node = $(`div[ubt-data-title='美食']`);
    return node.length > 0;
}

// 是否为店铺列表页面
function isShopList($) {
    return getShopList($).length > 0;
}

// 获得食物分类入口的标记
function getFoodEntryIds(pageContent) {
    return [`div[ubt-data-title='美食']`];
}

// 获得店铺列表
function analyzeShopListPage(pageContent) {

    const $ = cheerio.load(pageContent);
    return { shops: getShopList($) }

}

function getShopList($) {
    let shops = [];
    $(`ul section`).each((i, el) => {
        const shopClass = $(el).attr('class');
        if (/shop-\d+/.test(shopClass)) {
            shops = _.concat(shops, { shopClass, shopName: cheerio(el).text() });
        }
    });

    return shops
}

// 分析店铺首页
//
//  products, buttons 
function analyzeShopHomePage(pageContent) {
    const $ = cheerio.load(pageContent, { decodeEntities: false });
    return {
        shopTabs: getShopTabs($),
        shopInfo: getShopInfo($),
        products: getShopProducts($),
    }
}

// 
function getShopTabs($) {
    let tabs = []
    $('#shoptab p').each((i, el) => {
        tabs = _.concat(tabs, { tabClass: $(el).attr('class'), tabName: _.trim($(el).text()) })
    });

    return tabs;
}

function getShopInfo($) {
    const shopName = $(`span.index-UYhnL`).text();

    const nodes = $(`span.index-2u0xV`);
    const shopScore = $(nodes[0]).text();
    const sellMonthly = $(nodes[1]).text();
    const shopAddress = getShopAddress($);
    return { shopName, shopScore, sellMonthly, shopAddress };
}

function getShopAddress($) {
    const myregexp = /<span>地址<\/span><span>(.*?)<\/span>/im;
    const match = myregexp.exec($('ul.detail-3mz9N').html());
    if (_.isNil(match)) return '';
    return match[1];
}

function getShopProducts($) {
    let pds = []
    $('.menuview-menuList_JqDMu dd').each((i, el) => {
        const pd = getProductInfo($(el).html());
        if (!_.isNil(pd)) pds = _.concat(pds, pd);
    });

    return pds
}

function getProductInfo(html) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const productName = $('.fooddetails-nameText_250s_').text();
    const productDescription = $('.fooddetails-desc_3tvBJ').text();
    const productSellInfo = $('.fooddetails-sales_1ETVq').text()
    if (_.isEmpty(productName)) return undefined;
    return { productName, productDescription ,productSellInfo}
}

module.exports = {
    analyzePageStage,
    PAGE_STAGE_UNDEFINED,
    PAGE_STAGE_ASK_LOGIN,
    PAGE_STAGE_FOOD_ENTRY,
    PAGE_STAGE_SHOP_LIST,
    getFoodEntryIds,
    analyzeShopListPage,
    analyzeShopHomePage,
}
