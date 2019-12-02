/* eslint-disable no-undef */
//
// 结果存储器工厂测试
//
const { rsFactory } = require('../../libs/toucan-result-store');
const { isObject } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - result store factory', () => {

    it('dir store', async () => {
        const rs = await rsFactory.create({ queue: 'abc', outDir: '123' });
        expect(isObject(rs, 'DirResultStore')).is.true;
    })

    it('mysql store', async () => {
        const rs = await rsFactory.create({ queue: 'abc', storeType: 'tc-mysql' }, true);
        expect(isObject(rs, 'MysqlResultStore')).is.true;
    })

    it('mongodb store', async () => {
        const rs = await rsFactory.create({ queue: 'abc', storeType: 'tc-mongodb' });
        expect(isObject(rs, 'MongoDbResultStore')).is.true;
    })

    it('ali 1688 product detail store', async () => {
        const rs = await rsFactory.create({ queue: 'abc', storeType: 'ali-1688-product-detail' });
        expect(isObject(rs, 'Ali1688ProductDetailResultStore')).is.true;
    })
})