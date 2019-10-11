/* eslint-disable no-undef */
const expect = require('chai').expect;
const UrlPool = require('../../libs/toucan-spider/_layer-url-task-pool');

describe('layer url task pool 测试', () => {

    describe('isExist 测试', () => {
        it('不全格式比较', () => {
            const up = new UrlPool();
            up.push('www.19lou.com', 0);
            expectIsExist(up, '//www.19lou.com/', true)
            expectIsExist(up, 'www.19lou.com/a/', false)
            expectIsExist(up, 'https://www.19lou.com/', true)
        });
    });

    describe('pop 测试 ', () => {
        it('', () => {
            const up = new UrlPool();
            up.push('a1', 1);
            up.push('b1', 2);

            expect(up.pop(0),'pop(0)').is.empty;

            let layer1 = up.pop(1);
            expect(layer1).to.be.eq('a1');

            layer1 = up.pop(1);
            expect(layer1, '第2次pop应为空').is.empty;

            let layer2 = up.pop(2);
            expect(layer2).to.be.eq('b1');

            layer2 = up.pop(2);
            expect(layer2, '第2次pop应为空').is.empty;

            expect(up.isExist('a1')).is.true;
        })
    });

    describe('residualCount 测试', () => {

        it('', () => {
            const up = new UrlPool();

            up.push('a1', 1);
            up.push('b1', 2);

            expect(up.residualCount(1)).to.be.eq(1);
            expect(up.residualCount(2)).to.be.eq(1);

            expect(up.residualCount()).to.be.eq(2);

            up.pop(1);
            expect(up.residualCount(1)).to.be.eq(0);
            expect(up.residualCount()).to.be.eq(1);

        })
    });
})

function expectIsExist(up, url, val){
    expect(up.isExist(url), url).is[val]
}