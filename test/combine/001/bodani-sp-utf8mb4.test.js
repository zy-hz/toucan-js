/* eslint-disable no-undef */
const expect = require('chai').expect;
const { allTest } = require('../entry');

const suitInfo = {
    suitName: '伯大尼特殊测试-utf8mb4',
    suitId: 'bodani-sp-utf8mb4',
    suitRoot: __dirname
}

allTest(suitInfo, {
    expectDetailTable
})

function expectDetailTable(rows) {
    expect(rows).lengthOf(1);
}
