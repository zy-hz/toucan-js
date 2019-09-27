const moment = require('moment');
const { sleep } = require('../toucan-utility');

class SubscribeGatherTaskJob {
    constructor({
        gatherMQ
    }) {
        this.gatherMQ = gatherMQ;
    }

    async do() {

        try {

            console.log('beg', moment().format());
            await sleep(7000);
            console.log('end', moment().format());
        }
        catch (error) {

        }
    }
}

module.exports = { SubscribeGatherTaskJob };