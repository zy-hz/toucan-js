/* eslint-disable no-undef */
const expect = require('chai').expect;
const testSuit = require('../util/mocha-test-suit');
const cheerio = require('cheerio');

testSuit({
    only:true,
    targetUrl: 'http://delve.bodani.cn/',
    spiderType: 'http',
    // 自定义的验证
    otherExpect: [
        verifyPageCharset,
        verifyPageContent
    ]
});

// 验证页面的字符集
function verifyPageCharset({ pageCharset } = {}) {
    expect(pageCharset, '页面编码为 utf-8').to.match(/^utf-8$/im);
}

// 验证页面的内容
function verifyPageContent({ pageContent } = {}) {
    const $ = cheerio.load(pageContent);
    expect($('title').text()).eq('伯大尼—查经资料');
}
