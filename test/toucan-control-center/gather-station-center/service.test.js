/* eslint-disable no-undef */
const { GatherStationCenter } = require('../../../libs/toucan-control-center');
const expect = require('chai').expect;
const { getResponse } = require('../../toucan-service');

describe('temp [测试入口] - gather station service', () => {
    const startOptions = {
        // 监听端口
        //port: 1123,
        // 服务器的连接信息
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tc_gather_cc',
        }
    }
    describe('start', () => {

        before('', () => {
            GatherStationCenter.start(startOptions);
        })

        after('', () => {
            GatherStationCenter.stop();
        })

        it('WorkUnitInfo 测试', () => {
            const { unitName } = GatherStationCenter.unitInfo;
            expect(unitName).to.be.eq('GatherStationService');
            expect(GatherStationCenter.serviceName).to.be.eq('GatherStationService');
        })

        it('regist-station 测试', async () => {
            const query = { hostName: 'zyHost' };
            // 检测在指定的端口，是否能获得内容
            const { body, statusCode } = await getResponse('/regist-station', query);
            expect(statusCode).to.be.eq(200);

            const { success, result } = body;
            expect(success).is.true;
            expect(result.hostName).to.be.eql(query.hostName);
        })
    })
})