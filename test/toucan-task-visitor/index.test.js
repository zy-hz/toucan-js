/* eslint-disable no-undef */
const expect = require('chai').expect;
const tvFactory = require('../../libs/toucan-task-visitor');

describe('[测试入口] - TaskVisitorFactory', () => {

    it('create fakeTV', () => {

        const taskVsitor = tvFactory.create({dbType:'fake'});
        expect(taskVsitor).is.not.null;
    });
})