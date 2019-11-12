/* eslint-disable no-undef */
const lib = require('rewire')('../../libs/toucan-job/_regain-gather-result');
const saveResult = lib.__get__('saveResult')
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;

describe(' [测试入口] - regain gather result', () => {
    const dir = `${process.cwd()}/.cache/test-mock`;

    before('', () => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    })

    it('saveResult', () => {
        const fileName = saveResult({ msg: 'abc' }, dir);
        expect(fs.existsSync(fileName)).is.true;
    })

    it('1688 save result', () => {
        const sampleFileName = path.join(`${__dirname}`, 'sample', 'gather-result-page-1688-detail.json');
        const msg = JSON.parse(fs.readFileSync(sampleFileName,'utf8'));
        const fileName = saveResult(msg, dir);
        expect(fs.existsSync(fileName)).is.true;
    })
})