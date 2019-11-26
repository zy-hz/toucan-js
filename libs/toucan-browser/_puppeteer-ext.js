// 
// 封装puppeteer的功能
//
const _ = require('lodash');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const devices = require('puppeteer/DeviceDescriptors');

class PuppeteerExt1 {

    async init(options = {}) {
        if (_.isNil(this.browser)) this.browser = await this.createBrowser(options);
        // 创建页面
        if (_.isNil(this.page)) this.page = await this.createPage(this.browser, options);

    }

    async close() {
        if (!_.isNil(this.browser) && !_.isNil(this.page)) {
            await this.page.waitFor(2000);
            await this.page.close();
            delete this.page;
        }
    }

    // 是否准备好采集
    async isReady4Fetch() {
        // 浏览器对象必须准备好
        if (_.isNil(this.browser) || _.isNil(this.page)) return false;
        return true;
    }

    // 设置地理信息
    // await navigator.permissions.query({name: 'camera'}) 
    async setGeolocation(host, { latitude, longitude } = {}) {

        // // 授予更改地理位置的权限
        const context = this.browser.defaultBrowserContext();
        await context.overridePermissions(host, ['geolocation']);

        // 设置指定位置
        await this.page.setGeolocation({ latitude, longitude });
    }

    // 获得页面的内容
    async getPageContent() {
        return this.page.content();
    }

    // 创建浏览器对象
    async createBrowser(options = {}) {
        const { headless = false, devtools = false, userDataDir } = options;
        return await puppeteer.launch({
            // 设置用户目录，保证记录过程中的数据
            userDataDir,
            // 是否无头
            headless,
            // 是否启动调试
            devtools,
            slowMo: 500,
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
                '--single-process',
                '--window-size=300,900',
            ],
            // 禁止一些默认 
            // 有navigator.webdriver属性，防止被被前端js检测出来
            ignoreDefaultArgs: ["--enable-automation"]
        });
    }

    // 在浏览器上创建页面
    async createPage(browser, options = {}) {
        const { userDevice = 'iPhone 6', requestCookie = '' } = options;

        // 创建浏览器的新页面
        const page = await browser.newPage();
        // 设置用户设备信息
        await this.setUserDevice(page, userDevice);
        //await page.setCookie({'domain': 'h5.ele.me', 'name': 'pizza73686f7070696e67', 'value': '1MkK5-oAczE99P7yXnEoaCso6c6p8UIx9EZhmbNeuvQMF2ge2IW-wg'});

        return page;
    }

    async setUserDevice(page, userDevice) {
        const dev = devices[`${userDevice}`];
        await page.emulate(dev);
    }

    // 转向指定的url
    // waitForFlag 是jquery的选择器,例如： #elmid .elmclass a[name='tj_trnews']
    // waitForText 等待标签的文本
    async go(url, options = {}) {

        const {
            // 访问完成后，等待的时间
            waitForTime = 200,
            // 等待完成的标签
            waitForFlag = '',
            // 等待的文本内容
            waitForText = '',
        } = options;

        // 如果有多个跳转, response是最后一次跳转的响应
        const response = await this.page.goto(url);

        // 如果同时出现 waitForFlag，waitForText，只要发现一个就直接返回
        await Promise.race([
            async () => { if (!_.isEmpty(waitForFlag)) await this.page.waitForSelector(waitForFlag); },
            async () => { if (!_.isEmpty(waitForText)) await this.waitForText(this.page, waitForText); }
        ])

        // 等待的时间
        await this.page.waitFor(waitForTime);

        // 获得页面内容
        const pageContent = await this.page.content();

        return {
            response: { status: response._status, statusText: response._statusText },
            pageContent
        };
    }

    // 返回
    async back(options = {}) {
        await this.page.goBack(options);
    }

    // 点击指定的标签
    async click(selector, options = {}) {
        const { button, clickCount, delay = 76, watiForFlag = '', scrollCount = 0 } = options;

        //要注意如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation() Promise对象需要等待。
        const [response] = await Promise.all(
            [
                this.page.waitForNavigation(),
                this.page.tap(selector),

            ]
        );

        if (!_.isEmpty(watiForFlag)) {
            await this.page.waitForSelector(watiForFlag);
        }

        if (scrollCount > 0) {
            await this.autoScrollToEnd();
        }

        const pageContent = await this.page.content();
        return { response, pageContent };
    }

    // 等待文本的内容
    async waitForText(page, expectContent) {
        const pms = _.split(expectContent, ':');
        const elm = pms[0];
        const val = pms[1];

        let waitSecond = 0
        do {
            const pageContent = await page.content();
            const $ = cheerio.load(pageContent);

            const objs = $(`${elm}:contains(${val})`);
            // 发现了指定的标签
            if (objs.length > 0) return;

            // 等待1秒
            await page.waitFor(1000);
            waitSecond = waitSecond + 1;
        } while (waitSecond < 30);

        throw Error(`等待文本[${expectContent}]超过30秒`);
    }

    // 等待
    async waitFor(ms) {
        await this.page.waitFor(ms);
    }

    // 自动滚动-到底部
    async autoScrollToEnd() {
        await this.page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let totalHeight = 0;
                let distance = 500;
                let timer = setInterval(() => {
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
}

module.exports = { PuppeteerExt1 }