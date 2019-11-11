/* eslint-disable no-undef */
const { GatherStationCenter } = require('../../../libs/toucan-control-center');
const expect = require('chai').expect;

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

    before('', () => {
        GatherStationCenter.start(startOptions);
    })

    after('', () => {
        GatherStationCenter.stop();
    })

    describe('start', () => {

        it('WorkUnitInfo 测试', () => {
            const { unitName } = GatherStationCenter.unitInfo;
            expect(unitName).to.be.eq('GatherStationService');
            expect(GatherStationCenter.serviceName).to.be.eq('GatherStationService');
        })
    })
})