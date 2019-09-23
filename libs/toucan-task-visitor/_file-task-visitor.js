// 
// 任务接口-文件
//
// 
const _ = require('lodash');
const fs = require('fs');

class FileTaskVisitor {

    constructor(fileName) {
        this.__taskPool = buildTaskPool(fileName);
    }

    // 同步读取任务
    async readTaskSync({ maxCount = 1 } = {}) {
        this.__taskPool = _.orderBy(this.__taskPool, (x) => { return x.lastPublishTime || 0 });

        const tasks = _.forEach(_.slice(this.__taskPool, 0, maxCount), (x) => { x.lastPublishTime = _.now() });
        return _.map(tasks, (x) => {
            return {
                taskType: 'GatherTask',
                taskBody: x,
            }
        })
    }
}

// 构建任务池
function buildTaskPool(fileName) {
    const lines = _.split(fs.readFileSync(fileName), '\r\n');
    return _.map(lines, (ln) => {
        const pms = ln.split(/\t| +/im);
        let task = {};
        task.targetUrl = getTaskParam(pms, 0, '');
        task.spiderType = getTaskParam(pms, 1, '');
        task.depth = getTaskParam(pms, 2, -1);

        return task;
    });
}

function getTaskParam(ary, idx, val) {
    return ary.length > idx ? ary[idx] : val;
}


module.exports = FileTaskVisitor;