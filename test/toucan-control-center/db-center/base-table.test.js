/* eslint-disable no-undef */
const dbConnection = {
    host: '127.0.0.1',
    port: 3306,
    user: 'weapp',
    password: '123456',
    database: 'tc_gather_cc',
}

const uuid = require('uuid').v4;
const expect = require('chai').expect;

describe('[测试入口] - base table', () => {
    const dbv = require('../../../libs/toucan-control-center/db-center')(dbConnection).station;
    const stationHostname = uuid().substr(0, 32);
    const stationId = 'where-test';

    before('', async () => {
        await dbv.delete({ stationId });
    })

    beforeEach('', async () => {
        await dbv.insert({ stationId, stationHostname });
    })

    afterEach('', async () => {
        await dbv.delete({ stationId });

    })

    after('', async () => {
        await dbv.destroy();
    })

})