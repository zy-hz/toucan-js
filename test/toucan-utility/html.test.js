/* eslint-disable no-undef */
const { exHTML } = require('../../libs/toucan-utility');
const fs = require('fs');
const expect = require('chai').expect;

describe('[测试入口] - exHTML', () => {
    const htmlContent = fs.readFileSync(__dirname + '/sample/1688-product.html', 'utf-8');

    it('remove', () => {
        let result = exHTML.remove(htmlContent);
        expect(result.indexOf('<script') < 0).is.true;
        expect(result.indexOf('<style') < 0).is.true;
        expect(result.indexOf('<link') < 0).is.true;
    });

    it('extractContent',()=>{
        let result = exHTML.extractContent(htmlContent,true);
        expect(result.indexOf('<P>')<0).is.true;
    })

})