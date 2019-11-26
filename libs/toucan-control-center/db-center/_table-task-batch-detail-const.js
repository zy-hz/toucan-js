//
// 批次详情常量表
//

module.exports = {
    TABLENAME:'gt_batch_u',
    BATCHID:'batchId',          // 批次编号
    TASKID:'taskId',            // 任务编号
    TASKSTATE:'taskState',      // 0-ready,1-reset,10-queue,20-done,21-error
    TASKBODY:'taskBody',        // 任务体，json
    PRETASKID:'preTaskId',      // 上一级任务编号
    ROOTTASKID:'rootTaskId',    // 根任务的编号
    RUNCOUNT:'runCount',        // 运行次数，推入队列次数
    RESETCOUNT:'resetCount',    // 重置次数，（不包括整批重置
    DONECOUNT:'doneCount',      // 完成次数
    ERRORCOUNT:'errorCount',    // 错误的次数
    ERRORNO:'errorNo',          // 错误的编号
    ERRORMESSAGE:'errorMessage',// 错误的信息
    BEGINON:'beginOn',          // 任务开始时间，进入队列
    ENDON:'endOn',              // 任务结束时间
    PROCESSTIME:'processTime',  // 进程花费时间
    WORKTIME:'workTime',        // 实际工作时间
    STATIONNAME:'stationName',  // 工作的站点名称
    STATIONNO:'stationNo',      // 工作的站点编号
    STATIONIP:'stationIp',      // 工作的站点ip
    SPIDERNAME:'spiderName',    // 采集蜘蛛的名字
    SPIDERTYPE:'spiderType',    // 采集蜘蛛的类型
}