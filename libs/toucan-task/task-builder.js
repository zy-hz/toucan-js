const _ = require('lodash');

// 使用参数
function replaceTaskParams(s, pms) {
    if (_.isEmpty(pms)) return s;

    _.forEach(pms, (val, idx) => {
        const regex = new RegExp(`\\$\\{${idx}\\}`, 'im');
        s = _.replace(s, regex, val);
    })

    return s;
}

// 构建任务体
function buildTaskBody(jsonString, options = {}) {
    const obj = JSON.parse(jsonString);
    obj.targetUrl = replaceTaskParams(obj.targetUrl, obj);
    return _.assignIn(obj, options);
}

module.exports = {
    buildTaskBody,
    replaceTaskParams
}