/* eslint-disable no-undef */
const fs = require('fs');
const { TaskJob } = require('../../libs/toucan-job');

describe('TaskJob 测试 temp', () => {
    describe('logTaskPageDone', () => {
        const { task, page } = JSON.parse(fs.readFileSync(__dirname + '/sample/gather-result-page-19lou.json', 'utf-8'));
        it('', () => {
            const job = new TaskJob();
            job.logTaskPageDone(task, page);
        })
    })
})