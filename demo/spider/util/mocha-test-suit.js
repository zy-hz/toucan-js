/* eslint-disable no-undef */

//
// mocha 的测试套件
//

const expect = require('chai').expect;
const { spiderFactory } = require('../../../libs/toucan-spider');
const _ = require('lodash');

module.exports = (
    { only = false, targetUrl, spiderType, otherExpect = [] },
    // 用户定义的其他测试用例
    otherTestCase
) => {

    describe(`[蜘蛛测试] ${targetUrl} ${only?'temp':''}`, function () {

        // 设置错误重试次数
        // 使用该功能的时候，describe 不能写成 () => 形式
        this.retries(2);

        it('读取网页内容', async () => {
            const spider = spiderFactory.createSpider({ spiderType });

            const runResult = await spider.run({ targetUrl }, verfiyGatherResult.bind(this));
            verifyRunResult(runResult);

        });

        // 调用其他测试用例
        if (_.isFunction(otherTestCase)) otherTestCase();

    })

    // 验证采集结果
    function verfiyGatherResult({ task = {}, page = {} }) {
        try {
            // 验证页面结束时候的任务对象
            verifyRunResult(task, false);

            // 验证页面对象
            verfiyPageResult(page);

            // 调用其他验证
            _.castArray(otherExpect).forEach(x => { x(page) });

        }
        catch (error) {
            // 以下代码是为了抓住内部的验证异常
            console.error(error.message);
            throw error;
        }
    }

    function verfiyPageResult(page) {
        const { extractUrlSuccess, hasException, pageBeginTime, pageEndTime, pageSpendTime,
            spiderName, pageUrl,
            statusCode
        } = page;

        expect(extractUrlSuccess, 'extractUrlSuccess').is.true;
        expect(hasException, 'hasException').is.false;
        expect(pageBeginTime, 'pageBeginTime').above(0);
        expect(pageEndTime, 'pageEndTime').above(0);
        expect(pageSpendTime, 'pageSpendTime').above(0);

        expect(pageUrl, 'pageUrl').eq(targetUrl);
        expect(spiderName, 'spiderName').not.empty;
        expect(spiderName, 'spiderName不等于unknown').not.eq('unknown');
        expect(page.spiderType, 'spiderType').eq(spiderType);

        expect(statusCode, '状态码为200').to.be.eq(200);
    }

    // 验证运行结果
    function verifyRunResult(runResult, isEndTask = true) {

        const { extractUrlErrorCount,
            taskBeginTime, taskEndTime, taskSpendTime,
            taskDonePageCount, taskErrorPageCount, taskPlanPageCount
        } = runResult;

        expect(extractUrlErrorCount, 'extractUrlErrorCount').eq(0);

        expect(taskBeginTime, 'taskBeginTime').above(0);
        expect(taskSpendTime, 'taskSpendTime').above(0);

        expect(taskDonePageCount, 'taskDonePageCount').eq(1);
        expect(taskPlanPageCount, 'taskPlanPageCount').eq(1);
        expect(taskErrorPageCount, 'taskErrorPageCount').eq(0);

        if (isEndTask) {
            expect(taskEndTime, 'taskEndTime').above(0);
        }

    }

}
