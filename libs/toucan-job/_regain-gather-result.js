//
// 回收采集结果的作业
//

const { TaskJob } = require('./_base-task-job');
const { NullArgumentError } = require('../toucan-error');
const _ = require('lodash');

class RegainGatherResultJob extends TaskJob{
    constructor({
        gatherMQ
    }) {
        super();
        this.gatherMQ = gatherMQ;
    }

    
}

module.exports = { RegainGatherResultJob };