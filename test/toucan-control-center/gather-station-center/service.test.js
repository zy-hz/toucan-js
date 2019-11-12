/* eslint-disable no-undef */
const expect = require('chai').expect;
const { GatherStationCenter } = require('../../../libs/toucan-control-center');

// 服务的内容在toucan-sdk项目中测试

describe('[测试入口] - gather station service', () => {
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

    before('', async () => {
        await GatherStationCenter.start(startOptions);
    })

    after('', async () => {
        await GatherStationCenter.stop();
    })

    describe('start', () => {

        it('WorkUnitInfo 测试', () => {
            const { unitName } = GatherStationCenter.unitInfo;
            expect(unitName).to.be.eq('GatherStationService');
            expect(GatherStationCenter.serviceName).to.be.eq('GatherStationService');
        })
    })
})