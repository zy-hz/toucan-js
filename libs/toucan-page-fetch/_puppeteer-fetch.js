const _ = require('lodash');
const puppeteer = require('puppeteer');

class PuppeteerPageFetch {

    async do(url, option = {}) {

        // 有该标记，表示页面载入完成
        const { pageLoadDoneFlag = '' } = option;

        try {


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


            const page = await browser.newPage();

            await page.goto(url);

            // 如果有特殊的页面载入标记时，启动等待页面标记过程
            if (!_.isEmpty(pageLoadDoneFlag)) {
                await page.waitForSelector('.WB_frame');
            }

            const pageContent = await page.content();
            await browser.close();

            return {
                // 抓取过程是否异常
                hasException: false,
                // 页面内容
                pageContent,
                // 抓手类型
                fetchType: 'webpage',
                // 重试次数
                retryCount: 0,
                // 页面的原始字符集
                //pageCharset: response.charset,
                // 状态码
                //statusCode: response.statusCode
            };
        }
        catch (error) {
            const { code, errno, message, stack } = error
            return {
                // 抓取过程是否异常
                hasException: true,
                // 抓手类型
                fetchType: 'webpage',
                // 错误码
                code,
                // 错误码
                errno,
                // 错误信息
                message,
                // 调用堆栈
                stack
            }
        }
    }
}

module.exports = PuppeteerPageFetch;