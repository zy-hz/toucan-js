/* eslint-disable no-undef */
const { GatherStationCenter } = require('../../../libs/toucan-control-center');
const expect = require('chai').expect;

describe('[测试入口] - gather station service temp', () => {

    describe('start', () => {

        before('', () => {
            GatherStationCenter.start();
        })

        after('', () => {
            GatherStationCenter.stop();
        })

        it('WorkUnitInfo 测试', () => {
            const { unitName } = GatherStationCenter.unitInfo;
            expect(unitName).to.be.eq('GatherStationService');
        })

        it('', () => {
            // 检测在指定的端口，是否能获得内容
        })
    })
})