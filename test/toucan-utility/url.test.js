/* eslint-disable no-undef */
const { exURL } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - exURL', () => {
    describe('fillProtocol', () => {
        it('', () => {
            expect(exURL.fillProtocol('www.19lou.com')).to.be.eq('http://www.19lou.com');
            expect(exURL.fillProtocol('javascript:;')).to.be.eq('javascript:;');
            expect(exURL.fillProtocol()).is.undefined;
        })
    });

    describe('isSameUrl', () => {
        it('', () => {
            expect(exURL.isSameUrl('')).is.false;
            expect(exURL.isSameUrl('www.19lou.com', '//www.19lou.com/')).is.true;
            expect(exURL.isSameUrl('http://www.19lou.com', 'https://www.19lou.com/'),'https').is.true;
            expect(exURL.isSameUrl('http://www.19lou.com', '//www.19lou.com/a'),'/a').is.false;
            expect(exURL.isSameUrl('www.19lou.com/a?b=3', '//www.19lou.com/a?b=3'),'3').is.true;
            expect(exURL.isSameUrl('www.19lou.com/a?b=3', '//www.19lou.com/a?b=4'),'4').is.false;
        });
    })
})