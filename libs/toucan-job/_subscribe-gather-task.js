const moment = require('moment');
const { sleep } = require('../toucan-utility');

class SubscribeGatherTaskJob {
    constructor({
        gatherMQ
    }) {
        this.gatherMQ = gatherMQ;
    }

    // 注意：不是自己的异常，必须抛出，例如：gatherMQ的异常
    async do() {

        
        try {

            console.log('beg', moment().format());
            await sleep(1500);
            console.log('end', moment().format());
        }
        catch (error) {

        }
    }
}

module.exports = { SubscribeGatherTaskJob };