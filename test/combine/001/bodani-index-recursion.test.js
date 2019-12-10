/* eslint-disable no-undef */
const expect = require('chai').expect;
const { allTest } = require('../entry');
const suitInfo = {
    suitName: '伯大尼-递归测试',
    suitId: 'bodani-index',
    suitRoot: __dirname
}

function expectPlanTableWhenPublish(rows, runIndex) {
    console.log('plan', runIndex, rows.length);
}

function expectDetailTableWhenPublish(rows, runIndex) {
    console.log('detail', runIndex, rows.length);
}

function expectPlanTableWhenRegain(row) {
    const { taskDoneRate } = row;
    expect(taskDoneRate).above(0)
}

// 运行测试
allTest(suitInfo, {
    expectPlanTableWhenPublish,
    expectDetailTableWhenPublish,

    expectPlanTableWhenRegain,
    // 获取子任务,每次解析一个子任务
    extractSubTask: { extractEnable: true, extractOptions: { limitSubTask: 5 } },
    repeatCount: 10,
})
