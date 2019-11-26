//
// 工作计划
//

const Cron = require('cron-converter');
const DTF_LONG = require('./_datetime').DTF_LONG;

// cron风格计算下个时间
function cronNextTime(cronString) {
    const ci = new Cron();
    ci.fromString(cronString || '* * * * *');

    const sch = ci.schedule();
    return sch.next().format(DTF_LONG);

}

module.exports = { cronNextTime };