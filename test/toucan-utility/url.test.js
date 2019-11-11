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
            expect(exURL.isSameUrl('www.19lou.com', '//www.19lou.com/'), 'same').is.true;
            expect(exURL.isSameUrl('http://www.19lou.com', 'https://www.19lou.com/'), 'https').is.false;
            expect(exURL.isSameUrl('http://www.19lou.com', '//www.19lou.com/a'), '/a').is.false;
            expect(exURL.isSameUrl('www.19lou.com/a?b=3', '//www.19lou.com/a?b=3'), '3').is.true;
            expect(exURL.isSameUrl('www.19lou.com/a?b=3', '//www.19lou.com/a?b=4'), '4').is.false;
        });
    })

    describe('toUrlObject', () => {
        //const targetUrl2 = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

        it('simple', () => {
            const targetUrl = new URL('http://127.0.0.1:8080');
            expect(exURL.toUrlObject(targetUrl), 'URL object').to.be.eql(targetUrl);
            expect(exURL.toUrlObject('127.0.0.1:8080'), 'string val').to.be.eql(targetUrl);
            expect(exURL.toUrlObject('http://127.0.0.1:8080'), 'string val2').to.be.eql(targetUrl);
            expect(exURL.toUrlObject('//127.0.0.1:8080'), 'string val3').to.be.eql(targetUrl);
            expect(exURL.toUrlObject({ host: '127.0.0.1', port: 8080 }), 'obj val').to.be.eql(targetUrl);
        })
    })

    describe('isScript', () => {
        it('', () => {
            const url = '//food.19lou.com';
            expect(exURL.isScript(url)).is.false;
        })
    })

    describe('isSampHost', () => {
        it('http://#', () => {
            expect(exURL.isSameHost('http://#', 'http://#')).is.true;
        })
    })
})