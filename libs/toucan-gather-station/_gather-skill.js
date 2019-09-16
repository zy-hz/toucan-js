//
// 采集能力
//
const _ = require('lodash');

// 创建能力模板
function createGatherSkillTemplate(maxCount, gatherSkills) {

    // 根据能力的期望大小排序
    // 整数优先，分数其次，负数最后
    gatherSkills = _.orderBy(gatherSkills, 'skillCapability');
    // 从大到小的顺序
    gatherSkills = _.reverse(gatherSkills);

    // 创建能力模板数组
    let totalCapability = 0;
    return _.map(gatherSkills, (skillConfig) => {
        const skill = createSkill(skillConfig, maxCount, totalCapability);
        totalCapability = skill.skillCapability + totalCapability
        return skill
    })
}

// 创建一项技能
function createSkill(skillConfig, maxCount, hasCount) {
    // 重新设置技能的数量属性
    const skillCapability = Math.min(maxCount - hasCount, skillConfig.skillCapability);
    return Object.assign(skillConfig, { skillCapability });
}

module.exports = { createGatherSkillTemplate }