/* eslint-disable no-undef */
//
// 测试采集能力
//
const expect = require('chai').expect;
const { createGatherSkillTemplate } = require('../../libs/toucan-gather-station/_gather-skill');

describe('GatherSkill 测试 temp', () => {

    it('createGatherSkillTemplate 数量测试', () => {
        const gatherCells = [
            {
                skillName: 'http采集',
                skillKeys: ['cm.http', 'cm.browser'],
                skillCapability: 2,
            },
            {
                skillName: 'browser采集',
                skillKeys: ['cm.browser'],
                skillCapability: 1,
            },
            {
                skillName: '通用采集',
                skillKeys: ['cm.*'],
                skillCapability: 3,
            }
        ];

        let skillTemplates = createGatherSkillTemplate(6,gatherCells);
        expect(skillTemplates,'模板数量 = 6').to.have.lengthOf(6)

        skillTemplates = createGatherSkillTemplate(9,gatherCells);
        expect(skillTemplates,'模板数量 不超过 6').to.have.lengthOf(6)

        skillTemplates = createGatherSkillTemplate(4,gatherCells);
        expect(skillTemplates,'模板数量 = 4').to.have.lengthOf(4)
    });
});