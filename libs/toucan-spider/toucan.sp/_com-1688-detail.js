const { ToucanBaseSpider } = require('../_base-spider');
const PuppeteerPageFetch = require('../../toucan-page-fetch/_puppeteer-fetch');
const _ = require('lodash');
const { exHTML } = require('../../toucan-utility');
const errorConst = require('../../toucan-error').ErrorConst.spiderError;

class MobilePageFetch extends PuppeteerPageFetch {

    // 采集1688 页面详情的时候，有一些特殊的操作
    async specialOp(page, options = {}) {
        // 自动滚动到页面的结束
        await this.autoScroll(page);
    }
}

class PCPageFetch extends PuppeteerPageFetch {

    // PC端采集1688 页面详情的时候，有一些特殊的操作
    async specialOp(page, options = {}) {
        // 自动滚动到页面的结束
        await this.autoScroll(page);
    }
}

class Ali1688DetailSpider extends ToucanBaseSpider {

    constructor(option = {}) {
        // 设置蜘蛛的名称
        option.spiderName = 'Ali1688DetailSpider';
        // 继承基类的创建参数
        super(option);
    }

    async run(
        // 采集任务的参数
        task,
        // 提交采集的结果
        submitGatherResult) {

        // 使用移动入口
        const { useMobile = true } = task;

        // 当使用移动端模式时，修改目标地址
        // 访问的链接，例如：https://detail.1688.com/offer/xxxx60064.html
        if (useMobile) {
            this.pageFetch = new MobilePageFetch();
            task.targetUrl = task.targetUrl.replace(/detail\.1688\.com/img, "m.1688.com");
        }
        else {
            this.pageFetch = new PCPageFetch();
        }

        return await super.run(task, submitGatherResult);
    }

    async crawlOnePage(theTask, thePage, layerIndex) {
        // 基类爬行的结果
        // { crawlResult: response, extractUrlResult }
        const result = await super.crawlOnePage(theTask, thePage, layerIndex);

        // 分析页面内容，是否采集成功（有可能页面需要验证）
        const { crawlResult } = result || {};

        // 如果已经发生异常（采集过程），就不需要继续检查
        if (crawlResult.hasException) return result;

        const { pageContent } = crawlResult || {};
        const verifyResult = verifyContentPage(pageContent);

        // 如果验证结果没有异常，直接返回
        if (_.isNil(verifyResult) || _.isEmpty(verifyResult) || !verifyResult.hasException) return result;

        // 把验证的结果追加（替换）到采集结果中
        return Object.assign(result, { crawlResult: verifyResult });
    }
}

// 验证内容页面
function verifyContentPage(pageContent) {
    if (_.isNil(pageContent)) return null;

    // 提取文本的内容
    const txt = exHTML.extractContent(pageContent);

    // 提取要求登录的文本
    const loginTxt = includeLoginForm(txt);
    if (_.isEmpty(loginTxt)) return { hasException: false };
    // 设置错误代码
    const errno = errorConst.requireUserLoginError;

    return {
        // 抓取过程是否异常
        hasException: true,
        // 程序码
        code: 0,
        // 错误码
        errno,
        // 错误信息
        message: loginTxt,
        // 调用堆栈
        stack: txt
    };
}

// 包含登录信息
function includeLoginForm(txt) {
    if (_.isEmpty(txt)) return '';

    if (/请登录/im.test(txt)) return '请登录';
    if (/选择其中一个已登录的账户/im.test(txt)) return '选择其中一个已登录的账户';
    if (/短信校验码登录/im.test(txt)) return '短信校验码登录';

    return '';
}

module.exports = Ali1688DetailSpider;