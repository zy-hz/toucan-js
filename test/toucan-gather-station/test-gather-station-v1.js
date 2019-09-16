/* eslint-disable no-undef */
const ToucanGatherStation = require('../../libs/toucan-gather-station');
const expect = require('chai').expect;
const _ = require('lodash');

describe('GatherStationV1 测试 temp', () => {
    const cfgFileName = `${__dirname}/gsconfig.json`;

    it('读取配置文件', () => {
        const gs = new ToucanGatherStation(cfgFileName);
        expect(_.isNil(gs)).to.be.false;

        runExpect4GatherSkill(gs.stationConfig.gatherSkill);
    });
});


function runExpect4GatherSkill(gatherSkill) {

    expect(gatherSkill.maxGatherCellCount, 'maxGatherCellCount 需要大于0').to.be.greaterThan(0);

    runExpect4GatherCells(gatherSkill.gatherCells);
}

function runExpect4GatherCells(gatherCells) {
    expect(Array.isArray(gatherCells), '采集单元是个数组').to.be.true;
    expect(gatherCells, '采集单元不能是空数组').is.not.empty;

    _.forEach(gatherCells,runExpect4skillCell)
}

// 技能单元测试
function runExpect4skillCell(skillCell){
    expect(skillCell.skillName,'能力名称不能空').is.not.empty;
    expect(Array.isArray(skillCell.skillKeys),'能力关键词是个数组').to.be.true;
    expect(skillCell.skillKeys,'能力关键词不能为空').is.not.empty;
    expect(_.isNil(skillCell.skillCapability),'能力的容量不能为空').to.be.false;
}