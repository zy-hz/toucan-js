/* eslint-disable no-undef */
const cache = require('../../../libs/toucan-gather-station/service/cache');
const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;

describe('[测试入口] - cache', () => {
    const cacheFile = path.resolve(`${process.cwd()}`, '.cache', 'test_gs_cache.json');
    const obj = { testA: 'a', testB: { c1: 1, c2: '我是' } };

    before('', () => {
        if (fs.existsSync(cacheFile)) fs.unlinkSync(cacheFile);
    })

    it('init', () => {
        cache.init(cacheFile);
        expect(cache.cacheFileName).to.be.eq(cacheFile);

    })

    it('set', () => {
        cache.set({ testA: 'a' });
        expect(cache.testA).to.be.eq(obj.testA);

        cache.set('testB', obj.testB);
        expect(cache.testB).to.be.eql(obj.testB);

        // 读取文件
        const content = fs.readFileSync(cacheFile);
        const jsonObj = JSON.parse(content);
        expect(jsonObj, 'json文件和obj一致').to.be.eql(obj);
    })

})