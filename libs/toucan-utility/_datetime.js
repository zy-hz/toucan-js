//
// 日期时间
//
const moment = require('moment');

// 长日期格式
const DTF_LONG = 'YYYY-MM-DD HH:mm:ss';

function currentDateTimeString() {
    return moment().format(DTF_LONG);
}

function getDateTimeString(dt, {
    // 在指定的时间上的偏移，可以正，可以负
    num = 0,
    // 偏移的单位 seconds | minutes | days | months
    unit = 'seconds' } = {}
) {
    return moment(dt).add(num, unit).format(DTF_LONG);
}

// a - b
function getDateTimeDiff(a, b, {
    // 返回绝对值
    abs = false,
    unit = 'seconds' }

) {
    const ma = moment(a);
    const mb = moment(b);

    const val = ma.diff(mb, unit);
    return abs ? Math.abs(val) : val;
}

module.exports = { currentDateTimeString, getDateTimeString, getDateTimeDiff, DTF_LONG }