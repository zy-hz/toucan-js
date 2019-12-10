/* eslint-disable no-undef */
const { rebuildTaskDb, rebuildResultDb, uploadTaskTest, publishTaskTest, subscribeTaskTest, regainTaskTest } = require('./util');
const _ = require('lodash');

const {
    connDbCenter, connResultCenter, rabbitMQ, gatherStationInfo,
    resultQueueName, resultTableName,
    resultQueue4Mysql, resultQueue4Dir
} = require('./env-const');

const mq = {
    mqType: 'rabbit', options: rabbitMQ,
    exchangeName: 'toucan.gather.task', queueName: 'toucan.cm.http'
};

function allTest(suitInfo, {
    expectDBTaskBody,
    expectMQTaskBody,

    expectDetailTableWhenPublish,
    expectPlanTableWhenPublish,

    expectDetailTableWhenRegain,
    expectPlanTableWhenRegain,

    resultTo = 'mysql',
    extractSubTask = {
        extractEnable: false
    },
    // 重复
    repeatCount = 0
}
) {
    const { suitName = '未定义' } = suitInfo || {};
    const title = `${_.padEnd(_.padStart(suitName, 30, '*'), 50, '*')}`
    describe(title, function () {

        before('初始化测试环境', async () => {
            await rebuildTaskDb(connDbCenter);
            await rebuildResultDb(connResultCenter, resultTableName);
        })

        // STEP1:导入采集任务
        uploadTaskTest(suitInfo, { dbConnection: connDbCenter }, { expectDBTaskBody });

        for (let i = 0; i <= repeatCount; i++) {

            // STEP2:发布采集任务
            publishTaskTest(suitInfo, { dbConnection: connDbCenter, mq }, i + 1, {
                expectMQTaskBody,
                expectDetailTable: expectDetailTableWhenPublish,
                expectPlanTable: expectPlanTableWhenPublish,
            });

            // STEP3:情报站采集 - 进入结果队列
            subscribeTaskTest(suitInfo, { mq, resultQueueName, gatherStationInfo });

            // STEP4:收集采集结果
            const resultQueue = resultTo === 'mysql' ? resultQueue4Mysql : resultQueue4Dir;
            regainTaskTest(suitInfo, {
                connDbCenter, connResultCenter, mq, resultQueueName,
                resultQueue: _.merge({}, resultQueue, { storeOptions: { extractSubTask } }),
                stationInfo: gatherStationInfo
            }, {
                expectDetailTable: expectDetailTableWhenRegain,
                expectPlanTable: expectPlanTableWhenRegain,
            });
        }

    })
}

module.exports = {
    allTest
}