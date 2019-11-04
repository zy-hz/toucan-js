// 
// 任务接口-文件
//
// 
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const {md5} = require('../../libs/toucan-utility');

class FileTaskVisitor {

    constructor(options = {}) {
        const { dbVisitor, urlFormat, enableCache = true } = this.getOptions(options);
        this.__taskPool = buildTaskPool(dbVisitor, urlFormat, enableCache);
    }

    getOptions(args) {
        if (_.isString(args)) return { dbVisitor: args, urlFormat: '' };

        return args;
    }

    // 同步读取任务
    async readTaskSync({ maxCount = 1 } = {}) {

        // 找出超时队列
        let readyTasks = _.filter(this.__taskPool, (x) => { return _.isNil(x.nextPublishTime) || x.nextPublishTime < _.now() });

        // 按照下次发布时间排序，从小到大
        readyTasks = _.orderBy(readyTasks, (x) => { return x.nextPublishTime || 0 });

        // 按照数量获取队列
        readyTasks = _.slice(readyTasks, 0, maxCount)
        return _.map(readyTasks, (x) => {
            x.nextPublishTime = moment().add(5, 'seconds').valueOf()
            return {
                taskType: 'GatherTask',
                taskBody: _.cloneDeep(x),
            }
        })
    }
}

// 构建任务池
function buildTaskPool(fileName, urlFormat = '', enableCache = true) {
    const lines = readTaskLines(fileName, enableCache);
    return _.map(lines, (ln) => {
        const pms = ln.split(/\t| +/im);
        let task = {};
        task.targetUrl = applyFormat(getTaskParam(pms, 0, ''), urlFormat);
        task.spiderType = getTaskParam(pms, 1, '');
        task.depth = getTaskParam(pms, 2, -1);

        return task;
    });
}

// 读取任务行
function readTaskLines(fileName, enableCache) {
    const lines = _.split(fs.readFileSync(fileName), '\r\n');
    if (!enableCache) return lines;

    const cacheFileName = getTaskCacheFileName(fileName);
    // 读取缓存
    const existLines = fs.existsSync(cacheFileName) ? _.split(fs.readFileSync(cacheFileName), '\r\n') : [];
    return _.difference(lines, existLines);
}

// 获得指定任务的缓存文件名
function getTaskCacheFileName(fileName) {
    // 唯一标记
    const flag = md5(fileName);
    const extName = path.extname(fileName);
    return path.join(`${process.cwd()}/.cache/`,`${path.basename(fileName,extName)}_${flag}${extName}`);
}

function getTaskParam(ary, idx, val) {
    return ary.length > idx ? ary[idx] : val;
}

// 应用格式
function applyFormat(content, fmt) {
    if (_.isEmpty(fmt)) return content;
    return fmt.replace(/\$\{0\}/img, content);
}

module.exports = FileTaskVisitor;