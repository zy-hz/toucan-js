//
// 批量任务载入器
//
const fs = require('fs');
const encoding = require('encoding');
const _ = require('lodash');

function readContent(file) {
    // 自动判断编码格式，然后进行转换
    const content = fs.readFileSync(file, { encoding: 'binary' });
    return encoding.convert(content, 'utf8').toString();
}


// 行数据转为任务
// targetUrl 例如：
// http://detail.1688.com/offer/${productId}.html
// http://detail.1688.com/offer/${0}.html
function convertRow2Task(row, splitChar, fields, targetUrl) {

    row = _.trim(row);
    if (_.isEmpty(row)) return undefined;

    // 分割为字段
    const args = _.split(row, splitChar);
    const task = _.zipObject(fields, args);

    // 以下方法会大致载入时间大大增加
    // if (!_.isEmpty(targetUrl)) {
    //     targetUrl = replaceByParams(targetUrl, args);
    //     targetUrl = replaceByParams(targetUrl, task);
    // }

    // 如果 targetUrl 为空，使用第一个字段作为输出
    task.targetUrl = targetUrl || args[0];

    return task;
}

function load(contentFile,
    // batchFormat
    {
        // 行分隔符
        lineSplitChar = ';',
        // 定制字段名称
        lineFields = [],
        // 目标url的格式
        // http://detail.1688.com/offer/${productId}.html
        targetUrl = ''
    } = {},
    // partition 
    {
        // 分区数量
        segmentCount = 1,
        // 任务数量，如果指定任务数量> 0,按照任务数量平均分区
        taskCount = 0,
        // asc | desc ,如果为空的时候，保持输入时候的排序
        order = ''
    } = {}
) {
    // 如果文件不存在，返回空数组
    if (_.isString(contentFile) && !fs.existsSync(contentFile)) return [];

    // 读取文件内容 或者 数组
    const lines = _.isArray(contentFile) ? contentFile : _.split(readContent(contentFile), '\n');

    // 文件分组（先切割，以便处理大任务）
    if (taskCount === 0) taskCount = Math.ceil(lines.length / (segmentCount || 1));
    const batchs = _.chunk(lines, taskCount);

    // 当b数量到100w的时候，返回对象会到lodash异常中断，如果返回是字符串，就没有问题
    // 当b数量小于10w的时候，也没有问题
    // 很可能和batchs的数量的总和有关系

    return _.map(batchs, (b) => {
        let tasks = _.map(b, row => { return convertRow2Task(row, lineSplitChar, lineFields, targetUrl) });
        if (!_.isEmpty(order)) tasks = _.orderBy(tasks, ['targetUrl'], [`${order}`]);

        return _.filter(tasks, _.isObject);
    })

}

module.exports = {
    load
}