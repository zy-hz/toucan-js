/* eslint-disable no-undef */
const { exHTML } = require('../../libs/toucan-utility');
const fs = require('fs');
const expect = require('chai').expect;

describe('[测试入口] - exHTML', () => {

    describe('remove', () => {
        const htmlContent = fs.readFileSync(__dirname + '/sample/1688-product.html', 'utf-8');
        it('remove', () => {
            let result = exHTML.remove(htmlContent);
            expect(result.indexOf('<script') < 0).is.true;
            expect(result.indexOf('<style') < 0).is.true;
            expect(result.indexOf('<link') < 0).is.true;
        });

        it('removeTabCtrLn',()=>{
            const s = `{"targetUrl":"http://delve.bodani.cn/Processing Docs/Working Data/68Christ/跟随基督的脚踪行/Jesus130.htm","targetHrefText":"太二十三：11 -
            12 ","targetLayerIndex":3}`;
            const result = exHTML.removeTabCtrLn(s);
            expect(result).eq('{"targetUrl":"http://delve.bodani.cn/Processing Docs/Working Data/68Christ/跟随基督的脚踪行/Jesus130.htm","targetHrefText":"太二十三：11 -            12 ","targetLayerIndex":3}')
        })
    })

    describe('extractContent', () => {
        const htmlContent = fs.readFileSync(__dirname + '/sample/1688-product.html', 'utf-8');
        it('extractContent', () => {
            let result = exHTML.extractContent(htmlContent, true);
            expect(result.indexOf('<P>') < 0).is.true;
        })
    })

    describe('extractHyperlink', () => {
        it('1688', () => {
            const content = fs.readFileSync(__dirname + '/sample/1688-product.html', 'utf-8');
            const result = exHTML.extractHyperlink(content, { baseUrl: 'https://www.1688.com/' });
            expect(result).length.above(1);
        })

    })

})

