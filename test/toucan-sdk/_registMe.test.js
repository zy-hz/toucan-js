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

    before('', () => {
        GatherStationCenter.start(startOptions);
    })

    after('', () => {
        GatherStationCenter.stop();
    })

    it('gather station regist', async () => {
        const { code, result, error } = await tcSDK.registMe('127.0.0.1:1123', { listenPort: 57720 });
        expect(code).to.be.eq(0);
    })

    it('gather station update', async () => {
        const { code, result, error } = await tcSDK.registMe('127.0.0.1:1123', { machineKey: 'abc' });
        expect(code).to.be.eq(0);
    })

})