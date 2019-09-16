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
        expect(skillTemplates[0].skillCapability,'模板数量 = 3/6').to.be.eq(3)

        skillTemplates = createGatherSkillTemplate(9,gatherCells);
        expect(skillTemplates[2].skillCapability,'模板数量 = 1/9').to.to.be.eq(1);

        skillTemplates = createGatherSkillTemplate(4,gatherCells);
        expect(skillTemplates[2].skillCapability,'模板数量 = 0/4').to.to.be.eq(0);
        expect(skillTemplates[1].skillCapability,'模板数量 = 1/4').to.to.be.eq(1);
    });
});