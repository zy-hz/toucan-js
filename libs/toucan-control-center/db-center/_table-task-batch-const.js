//
// 采集批次表常量
//

module.exports = {
    TABLENAME: 'gt_batch',
    BATCHID: 'batchId',             // 批次编号
    BATCHNAME: 'batchName',         // 批次的名称
    BATCHCOMMENT: 'batchComment',   // 批次的备注
    BATCHOWNER: 'batchOwner',       // 批次的所有人
    BATCHGROUP: 'batchGroup',       // 批次所在组
    BATCHTAG: 'batchTag',           // 批次的标签
    BATCHSOURCE: 'batchSource',     // 批次载入的来源         
    TASKCOUNT: 'taskCount',         // 批次的任务数量
    RUNCOUNT: 'runCount',           // 运行次数
    CREATEON: 'createOn',           // 创建时间
    HOMEID: 'homeId',               // 批次组编号
    RUNPLAN:'runPlan',              // 运行计划，cron风格
    AUTORESET:'autoReset',          // 自动重置
}