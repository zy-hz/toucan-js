//
// 采集任务批次计划表常数
//

module.exports = {
    TABLENAME: 'gt_batch_plan',
    BATCHID: 'batchId',                 // 批次编号
    RUNCOUNT: 'runCount',               // 运行次数
    CREATEON: 'createOn',               // 创建时间
    BEGINON:'beginOn',                  // 开始时间
    ENDON:'endOn',                      // 结束时间
    ISEND:'isEnd',                      // 是否结束
    SPENDTIME:'spendTime',              // 花费时间
    HOMEID: 'homeId',                   // 批次组编号
    RUNPLAN: 'runPlan',                 // 运行计划，cron风格
    NEXTQUEUEON: 'nextQueueOn',         // 下次运行时间(推送到队列)
    LASTQUEUEON: 'lastQueueOn',         // 上次运行时间(推送到队列)
    LASTRESULTON: 'lastResultOn',       // 上次返回结果时间
    TASKDONECOUNT:'taskDoneCount',      // 任务完成数量
    TASKQUEUECOUNT: 'taskQueueCount',   // 任务排队的数量
    TASKRESIDUALCOUNT:'taskResidualCount',  // 任务剩余数量
    TASKDONERATE:'taskDoneRate',        // 任务正确率
    TASKERRORRATE:'taskErrorRate',      // 任务错误率
}