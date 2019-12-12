/* eslint-disable no-undef */
const expect = require('chai').expect;
const { allTest } = require('../entry');

const suitInfo = {
    suitName: '伯大尼首页测试',
    suitId: 'bodani-index',
    suitRoot: __dirname
}

allTest(suitInfo, {
    expectDBTaskBody: expectTaskBody, expectMQTaskBody:expectTaskBody, expectDetailTable
})

// 自定义的验证方法
function expectTaskBody(taskBody) {
    const { targetUrl } = taskBody;
    expect(targetUrl, 'targetUrl').eq('http://delve.bodani.cn/');
}


function expectDetailTable(rows) {
    expect(rows).lengthOf(1);
}
