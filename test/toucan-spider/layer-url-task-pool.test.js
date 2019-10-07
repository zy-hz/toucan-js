/* eslint-disable no-undef */
const expect = require('chai').expect;
const UrlPool = require('../../libs/toucan-spider/_layer-url-task-pool');

describe('layer url task pool 测试', () => {

    describe('isExist 测试', () => {
        it('先长后短', () => {
            const up = new UrlPool();
            up.push('abc123', 0);
            expect(up.isExist('abc')).is.true;
            expect(up.isExist('bC123')).is.true;
            expect(up.isExist('1234')).is.false;
        });

        it('先短后长', () => {
            const up = new UrlPool();
            up.push('123', 0);
            expect(up.isExist('abc123')).is.true;
            expect(up.isExist('bC123')).is.true;
            expect(up.isExist('1234')).is.true;
        });
    });

    describe('pop 测试', () => {
        it('', () => {
            const up = new UrlPool();
            up.push('a1', 1);
            up.push('b1', 2);

            expect(up.pop(0)).is.undefined;

            let layer1 = up.pop(1);
            expect(layer1.url).to.be.eq('a1');
            expect(layer1.isPop).is.true;

            layer1 = up.pop(1);
            expect(layer1, '第2次pop应为空').is.undefined;

            let layer2 = up.pop(2);
            expect(layer2.url).to.be.eq('b1');
            expect(layer2.isPop).is.true;

            layer2 = up.pop(2);
            expect(layer2, '第2次pop应为空').is.undefined;

            expect(up.isExist('a1')).is.true;
        })
    });
})