/* eslint-disable no-undef */
const fs = require('fs');
const { TaskJob } = require('../../libs/toucan-job');

describe('[demo] - TaskJob', () => {
    describe('logTaskPageDone', () => {
        it('success', () => {
            const { task, page } = JSON.parse(fs.readFileSync(__dirname + '/sample/gather-result-page-19lou.json', 'utf-8'));
            const job = new TaskJob();
            job.logTaskPageDone(task, page);
        })

        it('exception', () => {
            const { task, page } = JSON.parse(fs.readFileSync(__dirname + '/sample/gather-result-page-19lou-err1.json', 'utf-8'));
            const job = new TaskJob();
            job.logTaskPageDone(task, page);
        })

    })
})