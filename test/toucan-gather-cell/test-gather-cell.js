/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const ToucanGatherCell = require('../../libs/toucan-gather-cell');

describe('ToucanGatherCell 构造测试 temp', () => {

    it('', () => {
        const gatherCell = new ToucanGatherCell({ unitInfo: { unitNo: 'N1988' } });
        const { unitInfo } = gatherCell;

        expect(_.isNil(gatherCell), '对象不能为空').to.be.false;
        expect(_.isNil(unitInfo), '单元资料对象不能为空').to.be.false;
        expect(unitInfo.unitName, '单元名称为 GatherCell').to.be.eq('GatherCell');
        expect(unitInfo.unitNo, '单元编号为 N1988').to.be.eq('N1988');
        expect(_.isEmpty(unitInfo.unitId), '单元标识为 自动uuid').to.be.false;

    });
})