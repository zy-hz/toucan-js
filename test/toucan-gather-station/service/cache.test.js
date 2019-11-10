/* eslint-disable no-undef */
const cache = require('../../../libs/toucan-gather-station/service/cache');
const path = require('path');
const expect = require('chai').expect;

describe('temp [测试入口] - cache', () => {
    const cacheFile = path.resolve(`${process.cwd()}`, '.cache', 'test_gs_cache.json');

    it('init', () => {
        cache.init(cacheFile);
        expect(cache.cacheFileName).to.be.eq(cacheFile);

    })

    it('set',()=>{
        
    })

})