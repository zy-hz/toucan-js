//
// 日期时间
//
const moment = require('moment');

// 长日期格式
const DTF_LONG = 'YYYY-MM-DD HH:mm:ss';

function currentDateTime() {
    return moment().format(DTF_LONG);
}

module.exports = { currentDateTime }