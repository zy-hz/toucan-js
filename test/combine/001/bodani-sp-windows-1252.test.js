/* eslint-disable no-undef */
const expect = require('chai').expect;
const { allTest } = require('../entry');

const suitInfo = {
    suitName: '伯大尼特殊测试-windows-1252',
    suitId: 'bodani-sp-windows-1252',
    suitRoot: __dirname
}

allTest(suitInfo, {
    expectDetailTable
})

function expectDetailTable(rows) {
    expect(rows).lengthOf(1);
}
