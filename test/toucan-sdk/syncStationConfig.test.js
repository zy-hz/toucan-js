/* eslint-disable no-undef */
const tcSDK = require('../../libs/toucan-sdk');
const { GatherStationCenter } = require('../../libs/toucan-control-center');
const expect = require('chai').expect;

describe('[测试入口] - sync station config', () => {
    const startOptions = {
        // 监听端口
        port: 1123,
        // 服务器的连接信息
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tc_gather_cc',
        }
    }
    const dbc = require('../../libs/toucan-control-center/db-center')(startOptions.dbConnection).station;

    // 我注册的信息
    const meInfo = {
        stationId: 'test-syncstationconfig', stationHostname: 'DESKTOP-19SS3KS',
        stationMD5: 'ff80d075f48a06e3960578327908e4f6',
        stationKey: 'testABC'
    }


    before('', async () => {
        await GatherStationCenter.start(startOptions);

        // 删除指定对象
        await dbc.delete({ stationHostname: meInfo.stationHostname });
        // 在数据库中添加本机
        await dbc.insert(meInfo);

    })

    after('', async () => {
        await GatherStationCenter.stop();
        await dbc.destroy()
    })

    it('', async () => {
        const { code, result } = await tcSDK.syncStationConfig(`${startOptions.dbConnection.host}:${startOptions.port}`, { stationKey: meInfo.stationKey });
        expect(code).to.be.eq(0);

        expect(result.gatherSkill).is.not.undefined;
        expect(result.gatherSkill.maxGatherCellCount).is.greaterThan(0);
    })
})