/* eslint-disable no-undef */
const pageFetchFactory = require('../../libs/toucan-page-fetch/index');
const PuppeteerPageFetch = require('../../libs/toucan-page-fetch/_puppeteer-fetch');
const { exHTML } = require('../../libs/toucan-utility');
const expect = require('chai').expect;
const cheerio = require('cheerio');

describe('[demo]puppeteer 测试  ', () => {

    describe('操作测试', () => {
        // 定义自动滚动类
        class ScrollPageFetch extends PuppeteerPageFetch {
            async specialOp(page, options = {}) {
                await this.autoScroll(page);
            }
        }

        it('滚动', async () => {
            const pageFetch = new ScrollPageFetch();
            const url1 = 'https://m.1688.com/offer/602752160064.html?spm=a260j.12536015.jr601u7p.2.145d700eMEM6by';
            const url2 = 'https://detail.1688.com/offer/601818890874.html?spm=a2633q.13149856.jzcrmzl2.6.6af151d0ZID7Jp&scm=1007.26309.139606.0&udsPoolId=1373831&resourceId=1124979&__noNativeRedirect__=1';
            const result = await pageFetch.do(url1, { headless: false });
            expect(result.hasException, 'hasException').is.false;

            const content = exHTML.extractContent(result.pageContent, true);
            expect(content.indexOf('莎诺国际G4642图片包百度网盘下载') > 0).is.true;
        })
    });

    describe('[long]特殊页面采集测试', () => {

        it('do www.weibo.com 使用浏览器抓手测试', async () => {
            const pageFetch = pageFetchFactory.createFetch({ fetchType: 'webpage' });
            const url = 'https://www.weibo.com/'
            const res = await pageFetch.do(url, { pageLoadDoneFlag: '.WB_frame', headless: true });
            expect(res, '页面抓取结果不能为空').to.be.not.empty;

            // 检查是否发生异常
            expect(res.hasException, res.message).to.be.false;

            // 页面解析
            const $ = cheerio.load(res.pageContent)
            expect($('title').text(), '微博标题检查').to.be.eq('微博-随时随地发现新鲜事')

        });

    });

})