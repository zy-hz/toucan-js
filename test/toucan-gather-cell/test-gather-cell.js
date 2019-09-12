/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const { sleep } = require('../../libs/toucan-utility');
const ToucanGatherCell = require('../../libs/toucan-gather-cell');

describe('ToucanGatherCell 构造测试 temp', () => {

    it('', async () => {
        // 固定时间
        const theTime = _.now()
        const gatherCell = new ToucanGatherCell({ unitInfo: { unitNo: 'N1988' } });
        const { unitInfo, workInfo } = gatherCell;

        expect(_.isNil(gatherCell), '对象不能为空').to.be.false;
        expect(_.isNil(unitInfo), '单元资料对象不能为空').to.be.false;
        expect(unitInfo.unitName, '单元名称为 GatherCell').to.be.eq('GatherCell');
        expect(unitInfo.unitNo, '单元编号为 N1988').to.be.eq('N1988');
        expect(_.isEmpty(unitInfo.unitId), '单元标识为 自动uuid').to.be.false;

        expect(_.isNil(workInfo), '工作信息不能为空').to.be.false;
        expect(workInfo.unitStartTime, '单元启动时间 小于').to.be.greaterThan(theTime);
        expect(workInfo.unitStartTime, '单元启动时间 大于0').to.be.lessThan(_.now());

        // 测试启动时间
        await sleep(100);
        let d1 = gatherCell.workInfo.unitDuratioinTime
        expect(d1, '经历的时间 大于 0').to.be.greaterThan(0);

        await sleep(100);
        let d2 = gatherCell.workInfo.unitDuratioinTime
        expect(d2, 'd2 经历的时间 大于 d1').to.be.greaterThan(d1);
    });
})