/* eslint-disable no-undef */
const tcSDK = require('../../libs/toucan-sdk');
const { GatherStationCenter } = require('../../libs/toucan-control-center');
const expect = require('chai').expect;

describe('temp [测试入口] registMe', () => {
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
        stationId: 'test-00', stationHostname: 'DESKTOP-19SS3KS'
    }

    before('', async () => {
        await GatherStationCenter.start(startOptions);

        // 删除指定对象
        await dbc.delete({ stationId: meInfo.stationId });
        // 在数据库中添加本机
        await dbc.insert({ stationId: meInfo.stationId, stationHostname: meInfo.stationHostname });
    })

    after('', () => {
        //GatherStationCenter.stop();
    })

    it('gather station regist', async () => {
        const { code, result } = await tcSDK.registMe('127.0.0.1:1123', { listenPort: 57720 });
        expect(code).to.be.eq(0);

        expect(result.stationId).to.be.eq(meInfo.stationId);
        expect(result.stationHostname).to.be.eq(meInfo.stationHostname);
    })

    it('gather station update', async () => {
        const { code, result } = await tcSDK.registMe('127.0.0.1:1123', { machineKey: 'abc' });
        expect(code).to.be.eq(0);

        const { machineKey } = result;
        expect(machineKey).is.not.empty;
        expect(machineKey).not.eq('abc');
    })

})