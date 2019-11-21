/* eslint-disable no-undef */
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'weapp',
        password: '123456',
        database: 'tc_gather_cc',
    }
});
const uuid = require('uuid').v4;
const { joinWhere } = require('../../../libs/toucan-control-center/db-center/_base-where');
const expect = require('chai').expect;

describe('[测试入口] - base where', () => {
    const dbv = knex('gs');
    const hostname = uuid().substr(0, 32);
    const sid = 'where-test';

    beforeEach('', async () => {
        await dbv.insert({ stationId: sid, stationHostname: hostname });
    })

    afterEach('', async () => {
        const del = joinWhere(dbv, { stationId: sid }).del();
        await del;

    })

    after('',async()=>{
        await knex.destroy();
    })

    it('joinWhere = ', async () => {
        const select = joinWhere(dbv, { stationHostName: hostname });
        select._method = 'select';
        const result = await select;
        expect(result).have.lengthOf(1);
        expect(result[0].stationHostname).to.be.eq(hostname)
    })

    it('joinWhere > ', async () => {
        const select = joinWhere(dbv, 'stationId', '>', 'where-tess');
        select._method = 'select';
        const result = await select;
        expect(result).have.lengthOf(1);
    })
})