/* eslint-disable no-undef */
const { exHTML } = require('../../libs/toucan-utility');
const fs = require('fs');
const expect = require('chai').expect;

describe('exHTML 测试', () => {
    const htmlContent = fs.readFileSync(__dirname + '/sample/1688-product.html', 'utf-8');

    it('removeScript temp', () => {
        let result = exHTML.remove(htmlContent)
        console.log(result)
    })
})