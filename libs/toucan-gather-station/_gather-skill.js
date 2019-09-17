//
// 采集能力
//
const _ = require('lodash');

// 创建能力模板
function createGatherSkillTemplate(maxCount, gatherSkills) {

    // 后续操作会更改这个对象的值
    gatherSkills = _.cloneDeep(gatherSkills)

    // 计算能力数值
    const skillTemplate = calSkillCapabilty4All(maxCount, gatherSkills);

    return skillTemplate;
}

// 计算能力数值
function calSkillCapabilty4All(maxCount, gatherSkills) {
    // 根据能力的期望大小排序
    // 整数优先，分数其次，负数或者空最小
    gatherSkills = _.orderBy(gatherSkills, 'skillCapability');
    // 从大到小的顺序，数组越大越优先
    gatherSkills = _.reverse(gatherSkills);

    // 创建能力模板数组
    let totalCapability = 0;
    // 等待平均的能力总和
    let waitAvgCapability = maxCount;
    // 等待平均的能力个数
    let waitAvgCount = _.sumBy(gatherSkills, (x) => { return x.skillCapability >= 0 ? 0 : 1 });

    return _.map(gatherSkills, (skillConfig, idx) => {
        // 计算能力值
        const skillCapability = skillConfig.skillCapability >= 0
            ? calSkillCapabilty4One(maxCount, totalCapability, skillConfig.skillCapability)
            : calSkillCapabiltyAvg(waitAvgCount, waitAvgCapability, idx === gatherSkills.length - 1 ? maxCount - totalCapability : -1);

        // 合计能力总值
        totalCapability = skillCapability + totalCapability;
        // 如果不是自动分配类型的能力数量，
        if (skillConfig.skillCapability > 0) waitAvgCapability = waitAvgCapability - skillCapability;

        return Object.assign(skillConfig, { skillCapability });
    })
}


function calSkillCapabilty4One(maxCount, totalCapability, skillCapability) {
    // 整数类型的能力值 ，不超过剩余能力
    if (skillCapability >= 1) return Math.min(maxCount - totalCapability, skillCapability);
    // 分数类型的，取总和的百分数
    if (skillCapability > 0 & skillCapability < 1) return Math.min(maxCount - totalCapability, Math.floor(maxCount * skillCapability))

    return 0;
}

// 计算平均数
// 如果有指定的数值，就不用计算平均值
function calSkillCapabiltyAvg(waitAvgCount, waitAvgCapability, expectCount) {
    return expectCount < 0 ? Math.max(1, Math.floor(waitAvgCapability / waitAvgCount)) : expectCount;
}

module.exports = { createGatherSkillTemplate }