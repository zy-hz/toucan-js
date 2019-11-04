/* eslint-disable no-undef */
const lib = require('rewire')('../../libs/toucan-job/_regain-gather-result');
const saveResult = lib.__get__('saveResult')
const fs = require('fs');
const expect = require('chai').expect;

describe('[测试入口] - regain gather result', () => {

    it('saveResult', () => {
        const dir = `${process.cwd()}/.cache/test-mock`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        const fileName = saveResult({ msg: 'abc' }, dir);
        expect(fs.existsSync(fileName)).is.true;
    })
})