/* eslint-disable no-undef */
const expect = require('chai').expect;
const cheerio = require('cheerio');
const _ = require('lodash');

const pageFetchFactory = require('../../libs/toucan-page-fetch/index');

describe('[demo] request page fetch 测试',()=>{

    it('do s.weibo.com 搜索测试', async () => {
        const pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
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
        const pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
        const url = 'https:///weibo.com' // 出现异常
        const res = await pageFetch.do(url);
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.hasException, '发现异常').to.be.true;
        expect(res.code, '错误码').to.be.eq('ECONNREFUSED');

    });

    it('do www.qq.com 测试', async () => {
        const pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
        const res = await pageFetch.do('www.qq.com');
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);

        // 页面解析
        const $ = cheerio.load(res.pageContent);
        expect($('title').text()).to.be.eq('腾讯首页');
        expect($('#js_histitle', '.qq-channel3col').text().trim()).to.be.eq('历史');

    });
})

describe('speical 测试',()=>{

    it('[long] delve.bodani.cn测试',async()=>{
        const pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
        const res = await pageFetch.do('delve.bodani.cn');
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);
        expect(res.pageCharset, '页面编码为 utf-8').to.match(/^utf-8$/im);

    });

    it('[long] www.sina.com测试',async()=>{
        const pageFetch = pageFetchFactory.createFetch({ fetchType: 'request' });
        const res = await pageFetch.do('www.sina.com');
        expect(res, '页面抓取结果不能为空').to.be.not.empty;
        expect(res.statusCode, '状态码为成功').to.be.eq(200);
        expect(res.pageCharset, '页面编码为 utf-8').to.match(/^utf-8$/im);

    });
});