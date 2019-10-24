/* eslint-disable no-undef */
//
// 测试采集能力
//
const expect = require('chai').expect;
const { createGatherSkillTemplate } = require('../../libs/toucan-gather-station/_gather-skill');

describe('[测试入口] - GatherSkill 测试', () => {

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

    it('createGatherSkillTemplate 自动平均测试', () => {
        const gatherCells = [
            {
                skillName: 'http采集',
                skillKeys: ['cm.http', 'cm.browser'],
                skillCapability: -2,
            },
            {
                skillName: 'browser采集',
                skillKeys: ['cm.browser'],
                skillCapability: -1,
            },
            {
                skillName: '通用采集',
                skillKeys: ['cm.*'],
            }
        ];

        let skillTemplates = createGatherSkillTemplate(6,gatherCells);
        expect(skillTemplates[0].skillCapability,'模板数量 = 2/6').to.be.eq(2)

        skillTemplates = createGatherSkillTemplate(7,gatherCells);
        expect(skillTemplates[1].skillCapability,'模板数量 = 2/7').to.to.be.eq(2);
        expect(skillTemplates[2].skillCapability,'模板数量 = 3/7').to.to.be.eq(3);

        skillTemplates = createGatherSkillTemplate(2,gatherCells);
        expect(skillTemplates[2].skillCapability,'模板数量 = 0/2').to.to.be.eq(0);
        expect(skillTemplates[1].skillCapability,'模板数量 = 1/2').to.to.be.eq(1);
    });
});