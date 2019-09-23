/* eslint-disable no-undef */
const expect = require('chai').expect;
const tvFactory = require('../../libs/toucan-task-visitor');

describe('TaskVisitorFactory 测试', () => {

    it('create fakeTV', () => {

        const taskVsitor = tvFactory.create('');
        expect(taskVsitor).is.not.null;
    });
})