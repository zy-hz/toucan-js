/* eslint-disable no-undef */
const runner = require('../../../libs/toucan-gather-station/service/runners/regist-me-runner');
const cache = require('../../../libs/toucan-gather-station/service/cache');
const path = require('path');
const fs = require('fs');
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
const expect = require('chai').expect;
const { GatherStationCenter } = require('../../../libs/toucan-control-center');

describe('[测试入口] - regist me runner', () => {
    const cacheFileName = path.join(process.cwd(), '.cache', 'mock-test-regist-me-runner.json');
    const stationHostname = 'DESKTOP-19SS3KS';
    const stationId = 'test-01';
    const startOptions = {
        // 监听端口
        port: 1125,
        // 服务器的连接信息
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tc_gather_cc',
        }
    }
    const remote = `${startOptions.dbConnection.host}:${startOptions.port}`;

    before('', async () => {
        await GatherStationCenter.start(startOptions);
        // 清空缓存
        if (fs.existsSync(cacheFileName)) fs.unlinkSync(cacheFileName);
        cache.init(cacheFileName);

        await knex('gs').where({ stationHostname }).del()
        await knex('gs').insert({ stationId, stationHostname });
    })

    after('', async () => {
        await GatherStationCenter.stop();
        await knex.destroy();
    })

    it('scheduleWork regist', async () => {
        await runner.scheduleWork({ remote, port: 57721 });
        expect(cache.stationKey).is.not.empty;
    })

    it('scheduleWork update', async () => {
        await runner.scheduleWork({ remote, port: 57721 });
        expect(cache.stationKey).is.not.empty;
    })
})