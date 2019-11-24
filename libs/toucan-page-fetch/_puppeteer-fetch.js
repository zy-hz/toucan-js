const _ = require('lodash');
const puppeteer = require('puppeteer');
const util = require('./_common-utility');
const userAgents = require('./_user-agent');
const ToucanPageFetch = require('./_base-fetch');
const { onException } = require('./_fetch-exception');
const { exCookie } = require('../toucan-utility');

class PuppeteerPageFetch extends ToucanPageFetch {

    constructor() {
        super();
        this.fetchType = 'webpage';
    }

    async do(url, options = {}) {

        // 有该标记，表示页面载入完成
        const { headless = true, viewPort = { width: 1280, height: 768 }, requestCookie = '' } = options;

        try {
            // 用户的代理
            let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            // 根据选项构建url
            let visitUrl = util.buildUrl(url, options);

            const browser = await puppeteer.launch(
                {
                    // 是否无头
                    headless,
                    // 优化Chromium启动项 ， 
                    // 参考 https://juejin.im/post/5ce53c786fb9a07f014ecbcd
                    args: [
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--disable-setuid-sandbox',
                        '--no-first-run',
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--no-zygote',
                        '–single-process'
                    ],
                    // 有navigator.webdriver属性，防止被被前端js检测出来
                    ignoreDefaultArgs: ["--enable-automation"]
                });

            // 创建浏览器的新页面
            const page = await browser.newPage();
            // 设置用户类型
            await page.setUserAgent(userAgent);
            // 设置屏幕分辨率
            await page.setViewport(viewPort);
            //await page.setCookie({'domain': 'h5.ele.me', 'name': 'pizza73686f7070696e67', 'value': '1MkK5-oAczE99P7yXnEoaCso6c6p8UIx9EZhmbNeuvQMF2ge2IW-wg'});
            // 前往页面地址
            const response = await page.goto(visitUrl);

            // 执行一些特殊的操作，运行子类重载该方法，实现子类的功能
            await this.specialOp(page, options);

            // 获得页面内容
            const pageContent = await page.content();
            // 关闭浏览器
            await browser.close();

            return response._status == 404
                ? onException({
                    code: 404, errno: 404,
                    message: '服务器返回404错误',
                    stack: pageContent,
                }, this.fetchType)
                : {
                    // 抓取过程是否异常
                    hasException: false,
                    // 页面内容
                    pageContent,
                    // 抓手类型
                    fetchType: this.fetchType,
                    // 重试次数
                    retryCount: 0,
                    // 页面的原始字符集
                    //pageCharset: response.charset,
                    // 状态码
                    statusCode: response._status
                };
        }
        catch (error) {
            return onException(error, this.fetchType)
        }
    }

    // 自动滚动
    async autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 500;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    // 一些特殊的操作
    async specialOp(page, options = {}) {
        const { pageLoadDoneFlag = '' } = options;
        // 如果有特殊的页面载入标记时，启动等待页面标记过程
        if (!_.isEmpty(pageLoadDoneFlag)) {
            await page.waitForSelector(pageLoadDoneFlag);
        }
    }
}

module.exports = PuppeteerPageFetch;