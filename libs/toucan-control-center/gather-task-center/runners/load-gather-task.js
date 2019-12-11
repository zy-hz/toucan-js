//
// 从指定的数据源载入采集任务到采集任务数据库
//
const { ToucanRunner } = require('../../../toucan-service');
const _ = require('lodash');
const path = require('path');
const { DirTaskManager, currentDateTimeString, cronNextTime } = require('../../../toucan-utility');
const dbConst = require('../../db-center/const');
const batchTaskLoader = require('../../../toucan-task/batch-task-loader');

class LoadGatherTaskRunner extends ToucanRunner {
    constructor() {
        super();
        // 修改默认的工作计划
        // 每分钟的第0秒开始工作
        this.defaultscheduleRule = '0 * * * * *';
    }

    // 初始化任务来源
    initTaskSource(options = {}) {
        const { taskSource = [] } = options;
        this.uploadSource = _.filter(taskSource, { dbType: 'dir' }).map(x => {
            x.dbPath = path.resolve(process.cwd(), x.dbVisitor);
            return x;
        });

        // 构建上传来源管理器
        this.sourceManager = new DirTaskManager(_.cloneDeep(this.uploadSource), { taskFileExt: '.tsk', contentFileExt: '.txt' });
    }

    async init(options = {}) {

        this.initTaskSource(options)

        // 工作计划 - 返回新options对象
        const { jobSchedule = {} } = options;
        return _.assignIn(options, { scheduleRule: jobSchedule.loadGatherTask });
    }

    // 载入一个任务
    async uploadTask(task, dbc) {
        const { batchInfo, sourceName, batchFormat, batchOptions, contentFile, partition, datas } = task;
        const { taskBatch, taskBatchDetail, taskBatchPlan } = dbc;

        this.log(`准备载入任务从[${sourceName}] - > ${contentFile}`);

        // 载入批量任务
        const batchTasks = batchTaskLoader.load(datas || contentFile, batchFormat, partition);
        if (_.isEmpty(batchTasks)) return false;

        let idx = 1;
        let homeId;
        for await (const b of batchTasks) {
            // 新建批次任务（添加到批次表）
            const batchId = await taskBatch.generateBatchId({ insertToTable: true });
            const rows = _.map(b, x => { return taskBatchDetail.newRow(batchId, x) });

            // 第一个batchId作为homeId
            if (_.isEmpty(homeId)) homeId = batchId;

            // 创建详情表
            const tableName = taskBatchDetail.getLikeTableName(batchId);
            await taskBatchDetail.createLikeTable(tableName);
            const tbvNewDetail = dbc.newTable(tableName, taskBatchDetail);

            // 插入表
            await tbvNewDetail.insertBatch(rows);

            // 若批次被分割为多个，则需要修改批次的名称
            const batchName = batchTasks.length > 1 ? `${batchInfo.batchName}_${idx}` : batchInfo.batchName;
            idx++;

            // 更新批次表
            await taskBatch.update(Object.assign({}, batchInfo, {
                batchId,
                batchName,
                batchSource: sourceName,
                batchOptions: JSON.stringify(batchOptions || {}),
                taskCount: rows.length,
                runCount: 1,
                createOn: currentDateTimeString(),
                homeId
            }), dbConst.taskBatch.BATCHID, batchId);

            // 下次批次工作时间
            const nextQueueOn = cronNextTime(batchInfo.runPlan);

            // 新建批次工作计划
            await taskBatchPlan.insert({
                batchId, homeId, runCount: 1,
                runPlan: batchInfo.runPlan, nextQueueOn,
                batchOptions: JSON.stringify(batchOptions || {}),
                createOn: currentDateTimeString(),
                // 任务的总数
                taskResidualCount: rows.length,
            });
        }

        return true;
    }

    async scheduleWork(options = {}) {

        // 获得准备上传的任务
        const tasks = this.sourceManager.getTask();
        if (_.isNil(tasks)) return false;

        const { dbConnection } = options;
        // 创建数据中心
        const dbc = require('../../db-center')(dbConnection);

        try {
            let doneCount = 0, errorCount = 0;
            for await (const t of tasks) {
                if (await this.uploadTask(t, dbc)) {
                    doneCount++;
                    this.sourceManager.setTaskDone(t);
                }
                else {
                    errorCount++;
                    this.sourceManager.setTaskError(t);
                }
            }

            if (doneCount > 0 || errorCount > 0) {
                this.log(`本次上传成功批次:${doneCount}个，发生错误批次：${errorCount}个`);
            }
        }
        finally {
            await dbc.destroy();
        }
    }
}

module.exports = new LoadGatherTaskRunner();