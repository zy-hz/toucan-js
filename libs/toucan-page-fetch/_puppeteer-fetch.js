const _ = require('lodash');
const puppeteer = require('puppeteer');
const util = require('./_common-utility');
const userAgents = require('./_user-agent');
const { onException } = require('./_fetch-exception');

class PuppeteerPageFetch {

    async do(url, option = {}) {

        // 有该标记，表示页面载入完成
        const { pageLoadDoneFlag = '' } = option;
        const fetchType = 'webpage';

        try {
            // 用户的代理
            let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            // 根据选项构建url
            let visitUrl = util.buildUrl(url, option);

            const browser = await puppeteer.launch(
                {
                    headless: true,
                    // 优化Chromium启动项 ， 
                    // 参考 https://juejin.im/post/5ce53c786fb9a07f014ecbcd
                    args: [
                        '–disable-gpu',
                        '–disable-dev-shm-usage',
                        '–disable-setuid-sandbox',
                        '–no-first-run',
                        '–no-sandbox',
                        '–no-zygote',
                        '–single-process'
                    ]
                });

            // 创建浏览器的新页面
            const page = await browser.newPage();
            // 设置用户类型
            await page.setUserAgent(userAgent)
            // 前往页面地址
            await page.goto(visitUrl);

            // 如果有特殊的页面载入标记时，启动等待页面标记过程
            if (!_.isEmpty(pageLoadDoneFlag)) {
                await page.waitForSelector(pageLoadDoneFlag);
            }

            // 获得页面内容
            const pageContent = await page.content();
            // 关闭浏览器
            await browser.close();

            return {
                // 抓取过程是否异常
                hasException: false,
                // 页面内容
                pageContent,
                // 抓手类型
                fetchType,
                // 重试次数
                retryCount: 0,
                // 页面的原始字符集
                //pageCharset: response.charset,
                // 状态码
                //statusCode: response.statusCode
            };
        }
        catch (error) {
            return onException(error, fetchType)
        }
    }
}

module.exports = PuppeteerPageFetch;