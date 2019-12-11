/* eslint-disable no-undef */
const expect = require('chai').expect;
const testSuit = require('../util/mocha-test-suit');
const cheerio = require('cheerio');

testSuit({
    only: false,
    targetUrl: 'http://delve.bodani.cn/Old%20Testament/10%202Sam/10Index.htm',
    spiderType: 'http',
    // 自定义的验证
    otherExpect: [
        verifyPageContent
    ]
});


// 验证页面的内容
function verifyPageContent({ pageContent } = {}) {
    const $ = cheerio.load(pageContent);
    expect($('title').text()).eq('查經資料大全');
}
