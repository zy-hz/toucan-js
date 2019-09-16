//
// 采集能力
//
const _ = require('lodash');

// 创建能力模板
function createGatherSkillTemplate(maxCount, gatherSkills) {

    // 根据能力的期望大小排序
    gatherSkills = _.orderBy(gatherSkills,compareSkillCapability);

    return _.map(gatherSkills, (skill) => {

    })
}

function compareSkillCapability(a,b){
    console.log(a,b)
}

module.exports = { createGatherSkillTemplate }