/* eslint-disable no-undef */
const expect = require('chai').expect;
const testSuit = require('../util/mocha-test-suit');
const cheerio = require('cheerio');

testSuit({
    // 只允许自己运行
    only: false,
    targetUrl: 'https://www.19lou.com/',
    spiderType: 'http',
    // 自定义的验证
    otherExpect: [
        verifyPageCharset,
        verifyPageContent
    ]
});

// 验证页面的字符集
function verifyPageCharset({ pageCharset } = {}) {
    expect(pageCharset, '页面编码为 GB2312').to.match(/^gb2312$/im);
}

// 验证页面的内容
function verifyPageContent({ pageContent } = {}) {
    const $ = cheerio.load(pageContent);
    expect($('title').text().trim()).eq('杭州19楼-找对象、办婚礼、搞装修、聊育儿、看小说、租房买卖二手房，就上19楼');
}
