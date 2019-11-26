//
// 目录任务管理器
//

const path = require('path');
const fs = require('fs');
const _ = require('lodash');

class DirTaskManager {

    constructor(
        // 来源的数组，每个元素是一个来源对象，包括：
        // dbPath - 目录
        // sourceName - 来源的名称
        srcArray = [],
        // 目录管理的选项，包括
        // taskFileExt - 任务文件的扩展名称
        // contentFileExt - 内容文件的扩展名称
        { taskFileExt = '', contentFileExt = '' } = {}
    ) {

        this.sourceArray = srcArray;
        this.options = { taskFileExt, contentFileExt };
    }

    // 从一个来源载入任务
    getTaskFromSource(src) {

        const { dbPath, sourceName } = src;
        if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

        // 过滤出包含任务文件的任务
        const files = _.filter(fs.readdirSync(dbPath), x => { return path.extname(x) === this.options.taskFileExt });
        const tasks = _.map(files, f => {
            const taskFile = path.resolve(dbPath, f);
            try {
                const t = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
                t.sourceName = sourceName;
                t.contentFile = path.resolve(dbPath, `${path.basename(f, this.options.taskFileExt)}${this.options.contentFileExt}`);
                t.taskFile = taskFile;

                return t;
            }
            catch (error) {
                console.log(`从文件${taskFile}载入任务发生异常。`, error)
                return undefined;
            }

        });

        return tasks;
    }


    // 获得数据路径中的所有任务
    getTask() {
        if (_.isEmpty(this.sourceArray)) return [];

        let result = [];
        _.forEach(this.sourceArray, src => {
            const tasks = this.getTaskFromSource(src);
            if (!_.isEmpty(tasks)) result = _.concat(result, tasks);
        });

        return result;
    }

    moveTaskFile(srcFile, targetPath) {
        const fileName = path.basename(srcFile);
        const targetFile = path.resolve(targetPath, fileName);
        fs.renameSync(srcFile, targetFile);
    }

    // 移动任务到目标位置，target是相对任务所在目录
    moveTask(task, target) {

        const dbPath = path.dirname(task.taskFile);
        const targetPath = path.resolve(dbPath, target);
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);

        this.moveTaskFile(task.taskFile, targetPath);
        this.moveTaskFile(task.contentFile, targetPath);
    }

    // 设置任务完成
    setTaskDone(task) {

        // 移动任务到done path
        this.moveTask(task, 'done');
    }

    setTaskError(task) {

        // 移动任务到error path
        this.moveTask(task, 'error');
    }

}

module.exports = { DirTaskManager };