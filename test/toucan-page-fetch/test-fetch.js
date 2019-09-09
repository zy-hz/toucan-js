/* eslint-disable no-undef */
const expect = require('chai').expect;
const cheerio = require('cheerio');

const ToucanPageFetch = require('../../libs/toucan-page-fetch/index');

describe('page fetch 测试', () => {

    it('do www.weibo.com 使用浏览器抓手测试', async () => {
        const pageFetch = new ToucanPageFetch();
        const url = 'https://www.weibo.com/'
        const res = await pageFetch.do(url, { fetchType: 'webpage', pageLoadDoneFlag: '.WB_frame' });
        expect(res, '页面抓取结果不能为空').to.be.not.empty;

        // 检查是否发生异常
        expect(res.hasException,res.message).to.be.false;

        // 页面解析
        const $ = cheerio.load(res.pageContent)
        expect($('title').text(),'微博标题检查').to.be.eq('微博-随时随地发现新鲜事')

    });


    it('do s.weibo.com 搜索测试', async () => {
        const pageFetch = new ToucanPageFetch();
        const url = 'https://s.weibo.com/weibo';
        const res = await pageFetch.do(url, { params: '吴亦凡' });
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);

        // 页面解析
        const $ = cheerio.load(res.pageContent);
        expect($('#pl_feedtop_top').text(), '搜索框不能为空').is.not.empty;
        expect($('input', '#pl_feedtop_top').attr('value')).to.be.eq('吴亦凡')
        expect($('.name', '.card-star-fiche').text().trim()).to.be.eq('Mr_凡先生');

    });

    it('do https:///weibo.com 异常测试', async () => {
        const pageFetch = new ToucanPageFetch();
        const url = 'https:///weibo.com' // 出现异常
        const res = await pageFetch.do(url);
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.hasException, '发现异常').to.be.true;
        expect(res.code, '错误码').to.be.eq('ECONNREFUSED');

    });

    it('do www.qq.com 测试', async () => {
        const pageFetch = new ToucanPageFetch();
        const res = await pageFetch.do('www.qq.com');
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);

        // 页面解析
        const $ = cheerio.load(res.pageContent);
        expect($('title').text()).to.be.eq('腾讯首页');
        expect($('#js_histitle', '.qq-channel3col').text().trim()).to.be.eq('历史');

    });

})