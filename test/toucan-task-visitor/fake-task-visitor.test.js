/* eslint-disable no-undef */
const expect = require('chai').expect;
const tvFactory = require('../../libs/toucan-task-visitor');

describe('[测试入口] - FakeFileTaskVisitor', () => {

    describe('readTaskSync', async () => {
        const tv = tvFactory.create({ dbType: 'fake' });
        const task = tv.readTaskSync();
        expect(task).is.not.null;
    });

})