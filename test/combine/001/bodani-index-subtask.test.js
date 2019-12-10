/* eslint-disable no-undef */
const expect = require('chai').expect;
const { allTest } = require('../entry');
const suitInfo = {
    suitName: '伯大尼首页测试-提取子任务',
    suitId: 'bodani-index',
    suitRoot: __dirname
}

// 自定义的验证方法
function expectTaskBody(taskBody) {
    const { targetUrl } = taskBody;
    expect(targetUrl, 'targetUrl').eq('http://delve.bodani.cn/');
}

function expectDetailTable(rows) {
    expect(rows).lengthOf(100);
}

function expectPlanTable(row) {
    const { isEnd, taskResidualCount, taskDoneRate } = row;
    expect(isEnd, 'isEnd').eq(0);
    expect(taskResidualCount, 'taskResidualCount').eq(99);
    expect(taskDoneRate).eq(1.00)
}

// 运行测试
allTest(suitInfo, {
    expectDBTaskBody: expectTaskBody, expectMQTaskBody: expectTaskBody, expectDetailTable, expectPlanTable,
    // 获取子任务
    extractSubTask: { extractEnable: true }
})
