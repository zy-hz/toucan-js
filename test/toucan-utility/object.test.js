/* eslint-disable no-undef */
const { getObjectMD5 } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - object', () => {

    it('getObjectMD5 simple', () => {
        const obj1 = { a: 1, b: 'abc' };
        expect(getObjectMD5(obj1)).to.be.eq('8cdf9cd8c94a29cdb2a6324691c23564');

        const obj2 = { b: 'abc', a: 1 };
        expect(getObjectMD5(obj2)).to.be.eq('8cdf9cd8c94a29cdb2a6324691c23564');
    })

    it('getObjectMD5 array', () => {
        const obj1 = ['a', 'b'];
        expect(getObjectMD5(obj1)).to.be.eq('e53f04d1bcc1428d9e8db9a93578c5eb');

        const obj2 = ['b', 'a'];
        expect(getObjectMD5(obj2)).to.be.eq('e53f04d1bcc1428d9e8db9a93578c5eb');
    })

    it('getObjectMD5 compare', () => {
        const obj1 = { a: 1, b: ['a', 'b'], c: { c1: 1, c2: ['a', 'b'] } };
        expect(getObjectMD5(obj1)).to.be.eq('a8285e5773ee803622e09a9cf4e0791d');

        const obj2 = { b: ['b', 'a'], c: { c2: ['b', 'a'], c1: 1 }, a: 1 };
        expect(getObjectMD5(obj2)).to.be.eq('a8285e5773ee803622e09a9cf4e0791d');
    })
})