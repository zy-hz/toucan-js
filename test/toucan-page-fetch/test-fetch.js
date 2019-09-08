/* eslint-disable no-undef */
const expect = require('chai').expect;
const cheerio = require('cheerio');

const ToucanPageFetch = require('../../libs/toucan-page-fetch/index');
const pageFetch = new ToucanPageFetch();

describe('page fetch 测试', () => {


    it('do www.weibo.com 首页测试', async () => {
        let url = 'https://www.weibo.com/'
        let res = await pageFetch.do(url);
        expect(res, '页面抓取结果不能为空').to.be.not.empty;

        // 页面解析
        $ = cheerio.load(res.pageContent)
        expect($('title', '微博标题检查').text()).to.be.eq('微博-随时随地发现新鲜事')
        console.log(res.pageContent)
    });


    it('do s.weibo.com 搜索测试', async () => {
        let url = 'https://s.weibo.com/weibo';
        let res = await pageFetch.do(url, { params: '吴亦凡' });
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);

        // 页面解析
        $ = cheerio.load(res.pageContent);
        expect($('#pl_feedtop_top').text(), '搜索框不能为空').is.not.empty;
        expect($('input', '#pl_feedtop_top').attr('value')).to.be.eq('吴亦凡')
        expect($('.name', '.card-star-fiche').text().trim()).to.be.eq('Mr_凡先生');

    });

    it('do https:///weibo.com 异常测试', async () => {
        let url = 'https:///weibo.com' // 出现异常
        let res = await pageFetch.do(url);
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.hasException, '发现异常').to.be.true;
        expect(res.code, '错误码').to.be.eq('ECONNREFUSED');
    });

    it('do www.qq.com 测试', async () => {
        let res = await pageFetch.do('www.qq.com');
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);

        // 页面解析
        $ = cheerio.load(res.pageContent);
        expect($('title').text()).to.be.eq('腾讯首页');
        expect($('#js_histitle', '.qq-channel3col').text().trim()).to.be.eq('历史');
    });

})