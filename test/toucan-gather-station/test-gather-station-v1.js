/* eslint-disable no-undef */
const ToucanGatherStation = require('../../libs/toucan-gather-station');
const expect = require('chai').expect;
const _ = require('lodash');

const lib = require("rewire")('../../libs/toucan-gather-station/_gather-statioin-v1');
const buildGatherCellPool = lib.__get__('buildGatherCellPool');
const buildGatherCells = lib.__get__('buildGatherCells');

describe('GatherStationV1 测试', () => {
    const cfgFileName = `${__dirname}/gsconfig.json`;

    it('读取配置文件 ', () => {
        const gs = new ToucanGatherStation(cfgFileName);
        expect(_.isNil(gs)).to.be.false;

        runExpect4GatherSkill(gs.stationConfig.gatherSkill);
    });

    it('初始化', () => {
        const gs = new ToucanGatherStation(cfgFileName);
        gs.init();
    });
});

describe('GatherStationV1 内部方法测试  ', () => {

    it('buildGatherCellPool 参数异常', () => {
        try {
            buildGatherCellPool();
        }
        catch (e) {
            expect(e.argName).to.be.eq('maxGatherCellCount');
        }

        try {
            buildGatherCellPool({ maxGatherCellCount: 5 });
        }
        catch (e) {
            expect(e.argName).to.be.eq('gatherCells');
        }
    });

    it('buildGatherCells 1模板2实例测试 temp', () => {
        const skill = {
            skillName: 'http采集',
            skillKeys: ['cm.http', 'cm.browser'],
            skillCapability: 2,
        }
        const gcs = buildGatherCells(skill);
        expect(gcs).to.have.lengthOf(2);
        expect(gcs[1].mqVisitor).is.not.null;
        expect(gcs[1].unitInfo.unitNo).to.be.eq('02');
        expect(gcs[1].unitInfo.unitId).is.not.empty;

    });
});


function runExpect4GatherSkill(gatherSkill) {

    expect(gatherSkill.maxGatherCellCount, 'maxGatherCellCount 需要大于0').to.be.greaterThan(0);

    runExpect4GatherCells(gatherSkill.gatherCells);
}

function runExpect4GatherCells(gatherCells) {
    expect(Array.isArray(gatherCells), '采集单元是个数组').to.be.true;
    expect(gatherCells, '采集单元不能是空数组').is.not.empty;

    _.forEach(gatherCells, runExpect4SkillCell)
}

// 技能单元测试
function runExpect4SkillCell(skillCell) {
    expect(skillCell.skillName, '能力名称不能空').is.not.empty;
    expect(_.isArray(skillCell.skillKeys), '能力关键词是个数组').to.be.true;
    expect(skillCell.skillKeys, '能力关键词不能为空').is.not.empty;
}