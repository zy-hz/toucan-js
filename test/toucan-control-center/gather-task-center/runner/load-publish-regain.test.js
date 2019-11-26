/* eslint-disable no-undef */
//
// load publish regain 综合测试
//
const expect = require('chai').expect;
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const initdb = require('../../../../libs/toucan-service/_initdb');
const { DbVisitor, getDateTimeString } = require('../../../../libs/toucan-utility');
const mqCreate = require('../../../../libs/toucan-message-queue');

// 载入任务的运行器
const loadTaskRunner = require('../../../../libs/toucan-control-center/gather-task-center/runners/load-gather-task');
// 发布任务的运行器
const publishTaskrunner = require('../../../../libs/toucan-control-center/gather-task-center/runners/publish-gather-task');
// 回收任务的运行器
const regainTaskRunner = require('../../../../libs/toucan-control-center/gather-task-center/runners/regain-gather-result');

describe('[测试入口]load publish regain 综合测试', () => {
    // 启动的选项
    const options = {
        // 数据库连接
        dbConnection: {
            client: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tctest_gather_cc',
            charset: 'utf8'
        },
        // 数据来源
        taskSource: [
            {
                // 目录形式的数据源
                dbType: 'dir',
                // 数据目录的路径
                dbVisitor: './.sample/uploadTask',
                // 来源的名称
                sourceName: 'sample'
            },
            {
                // 目录形式的数据源
                dbType: 'file',
                // 数据目录的路径
                dbVisitor: 'ali.1688.detail_s.txt',
                // 来源的名称
                sourceName: 'test'
            }
        ],
        // 任务队列
        taskMQ: {
            // 消息队列的类型
            mqType: 'rabbit',
            // 发布采集任务的交换机
            exchangeName: 'toucan-test.gather.task',
            // 任务队列的其他选项
            options: {
                // 默认为本地服务器
                hostname: '127.0.0.1',
                // 默认服务端口
                port: 5672,
                // 虚拟机
                vhost: 'mock-test',
                // 连接主机的用户名
                username: 'guest',
                // 连接主机的密码
                password: 'guest',
            },
            // 结果队列
            resultQueue: [
                {
                    queue: 'toucan.gather.result.all',
                    outDir: '../output/result.all',
                    // 测试时可以设置 noAck = false
                    options: { noAck: true }
                }
            ]
        },
    }

    // 批量任务的模板, gt_batch表
    const taskTemplate = {
        batchInfo: {
            batchName: '1688产品详情采集任务-mock',
            batchComment: '[测试入口]load publish regain 综合测试',
            batchOwner: 'zy',
            batchGroup: 'mock',
            batchTag: 'taskTemplate',
            runPlan: '* * * * *',
            autoReset: false,
        },
        batchFormat: {
            lineSplitChar: ';',
            lineFields: [
                'productId',
                'memberId',
                'shopUrl'
            ],
            targetUrl: 'http://detail.1688.com/offer/${productId}.html'
        },
        // 分割参数
        partition: {
            // 分区数量
            segmentCount: 2,
            // 指定每个任务的数量
            taskCount: 0,
            // asc | desc | null
            order: 'asc'
        }
    }

    // 脚本路径
    const srciptPath = path.resolve(process.cwd(), 'libs/toucan-control-center/gather-task-center/scripts/init');
    // 数据库访问对象 - 直接访问数据库
    const dbv = new DbVisitor(options.dbConnection);
    // 数据中心对象 - 通过业务层操作
    const dbc = require('../../../../libs/toucan-control-center/db-center')(options.dbConnection);
    // 消息队列访问器
    const taskMQ = mqCreate.createTaskMQ('rabbit', options.taskMQ.options);
    const gatherMQ = mqCreate.createGatherMQ('rabbit', options.taskMQ.options);

    before('环境预备', async () => {
        // 删除所有的表
        await dbv.dropTables();
        // 初始化数据库
        await initdb(srciptPath, options);
    })

    after('', async () => {
        await dbv.close();
        await dbc.destroy();
    })

    // 载入
    describe('1-load', () => {
        // 从样本目录载入文件 
        // 样本文件一共7个任务
        // 分割为2个批次，分别为4个任务和3个任务
        taskTemplate.partition.segmentCount = 2;

        it('uploadTask', async () => {
            // 指定批量任务的的任务文件和内容文件
            const task = Object.assign(taskTemplate, {
                sourceName: 'uploadTask',
                taskFile: path.resolve(__dirname, '../sample', '1688.v2.tsk'),
                contentFile: path.resolve(__dirname, '../sample', '1688.v2.txt')
            });

            // 上传任务
            const result = await loadTaskRunner.uploadTask(task, dbc);
            expect(result, '上传成功').is.true;

            // 检查批次表
            const batches = await dbc.taskBatch.select();
            expect(batches, '任务批次 = 2').have.lengthOf(2);
            _.forEach(batches, b => { expect(b.runCount, b.batchId + ' runCount > 0').to.be.greaterThan(0) });

            // 检查计划表
            const batchPlans = await dbc.taskBatchPlan.select();
            expect(batchPlans, '任务计划 = 2').have.lengthOf(2);
            _.forEach(batchPlans, b => {
                expect(b.taskQueueCount, b.batchId + ' taskQueueCount = 0').to.be.eq(0);
                expect(b.taskQueueCount, b.batchId + ' taskQueueCount = 0').to.be.eq(0);
            });
            expect(batchPlans[0].taskResidualCount, '第一个任务计划数量为 4').to.be.eq(4);
            expect(batchPlans[1].taskResidualCount, '第一个任务计划数量为 3').to.be.eq(3)

            // 检查详情表
        })
    })

    // 发布
    describe('2-publish', () => {
        // 任务队列的名称
        const taskQueueName = 'toucan.sp.com.1688.detail'
        // 运行前的准备
        before('', async () => {
            await taskMQ.mqVisitor.deleteQueue(taskQueueName);

            // 绑定任务队列-准备接受消息
            gatherMQ.bindTaskQueue(taskQueueName);
        })

        // 首先初始化publish runner
        it('init', async () => {
            const result = await publishTaskrunner.init(options);
            expect(result.scheduleRule).is.not.empty;
        })

        // 发布任务
        it('publishBatches', async () => {
            // 因为刚加入表的记录 nextQueueOn = 当前的时间，所以需要假设当前时间为后1分钟，保证有数据取出
            const nowString = getDateTimeString(new Date(), { num: 1, unit: 'minutes' });
            // 发布消息到消息服务器
            const result = await publishTaskrunner.publishBatches(dbc, 1, nowString);
            expect(result, '一共2个').to.be.eq(2);

            // 检查消息服务器上的消息
            const msgs = await readMessageFromServer(gatherMQ, taskQueueName);
            expect(msgs, '消息队列有两个消息').have.lengthOf(2);

            // 批次计划表
            const batchPlans = await dbc.taskBatchPlan.select();

            // 批次计划和消息合成对象
            const mixObjects = _.zip(_.orderBy(msgs, 'batchId'), _.orderBy(batchPlans, 'batchId'));

            _.forEach(mixObjects, async (x) => {
                const msg = x[0];
                const b = x[1];

                // 检查批次计划表属性
                expect(b.taskQueueCount, b.batchId + ' taskQueueCount').to.be.eq(1);
                expect(getDateTimeString(b.lastQueueOn), 'lastQueueOn').to.be.eq(nowString);

                // 检查详情表(数据库检查)
                const tableName = dbc.taskBatchDetail.getLikeTableName(b.batchId);
                const tbv = dbc.newTable(tableName, dbc.taskBatchDetail);
                const pTasks = await tbv.select('taskState', 10);
                expect(pTasks).have.lengthOf(1);

                const task = pTasks[0];
                expect(task.runCount, b.batchId + ' runCount').to.be.eq(1);
                expect(task.taskId, 'taskId is msg.taskId').to.be.eq(msg.taskId);
            });

        })

        // 完成后，关闭运行器
        after('', async () => {
            await publishTaskrunner.stop();
            await taskMQ.disconnect();
            await gatherMQ.disconnect();
        })
    })

    // 回收
    describe('3-regain', () => {
        const resultQueueName = 'toucan.gather.result.all'
        const samplePath = path.resolve(__dirname, '../sample');

        let okGatherResult;
        let errorGatherResult;

        // 准备模拟结果
        before('', async () => {
            // 获得发布的2个任务编号
            const batches = await dbc.taskBatchPlan.select();
            okGatherResult = loadTaskFromFile(samplePath, 'regain-result-1688-smaill.json', batches[0]);
            errorGatherResult = loadTaskFromFile(samplePath, 'regain-result-1688-error.json', batches[1], true);
        })

        beforeEach('', async () => {
            // 清空结果队列
            await gatherMQ.mqVisitor.deleteQueue(resultQueueName);
        })

        // 首先初始化 regain task runner
        it('init', async () => {
            const result = await regainTaskRunner.init(options);
            expect(result.scheduleRule).is.not.empty;
        })

        // 测试成功的任务
        it('ok task', async () => {
            // 推送正确的任务结果到服务器
            await oneTaskTest(okGatherResult, true);
        })

        // 测试失败的任务
        it('error task', async () => {
            // 推送错误的任务结果到服务器
            await oneTaskTest(errorGatherResult, false);
        })

        // 一个任务的测试
        async function oneTaskTest(testObj, isOk) {
            const submitResult = await gatherMQ.submitResult(testObj, { queue: resultQueueName });
            expect(submitResult.hasException).is.false;

            // 获得任务
            const tasks = await regainTaskRunner.regainResult(5);
            expect(tasks).have.lengthOf(1);

            const task = tasks[0];
            expect(task.batchId, '批次编号一致').to.be.eq(testObj.task.batchId);

            // 更新任务到数据库
            await regainTaskRunner.updateTasks(tasks, options.dbConnection);

            // 验证
            const batchPlan = await dbc.taskBatchPlan.selectOne({ batchId: testObj.task.batchId });
            expect(batchPlan.taskQueueCount, 'taskQueueCount').to.be.eq(1);
            expect(batchPlan.taskDoneCount, 'taskDoneCount').to.be.eq(1);

            const tableName = dbc.taskBatchDetail.getLikeTableName(testObj.task.batchId);
            const tbv = dbc.newTable(tableName, dbc.taskBatchDetail);
            const batchTask = await tbv.selectOne({ batchId: testObj.task.batchId });
            expect(batchTask.workTime, 'workTime').to.be.eq(Math.ceil(testObj.task.taskSpendTime / 1000));
            expect(batchTask.spiderName, 'spiderName').to.be.eq(testObj.page.spiderName);
            expect(batchTask.spiderType, 'spiderType').to.be.eq(testObj.page.spiderType);

            expect(batchTask.stationName, 'stationName').to.be.eq(testObj.station.stationName);
            expect(batchTask.stationNo, 'stationNo').to.be.eq(testObj.station.stationNo);
            expect(batchTask.stationIp, 'stationIp').to.be.eq(testObj.station.stationIp);

            if (isOk) {
                expect(batchPlan.taskErrorCount, 'taskErrorCount').to.be.eq(0);
                expect(batchPlan.taskResidualCount, 'taskResidualCount').to.be.eq(3);
                expect(batchPlan.taskDoneRate, 'taskDoneRate').to.be.eq(25.00);
                expect(batchPlan.taskErrorRate, 'taskErrorRate').to.be.eq(0.00);

                expect(batchTask.taskState, 'taskState').to.be.eq(20);
                expect(batchTask.doneCount, 'doneCount').to.be.eq(1);
                expect(batchTask.errorCount, 'errorCount').to.be.eq(0);
                expect(batchTask.errorNo, 'errorNo').to.be.eq(0);
                expect(batchTask.errorMessage, 'errorMessage').is.empty;
            } else {
                expect(batchPlan.taskErrorCount, 'taskErrorCount').to.be.eq(1);
                expect(batchPlan.taskResidualCount, 'taskResidualCount').to.be.eq(2);
                expect(batchPlan.taskDoneRate, 'taskDoneRate').to.be.eq(33.33);
                expect(batchPlan.taskErrorRate, 'taskErrorRate').to.be.eq(33.33);

                expect(batchTask.taskState, 'taskState').to.be.eq(21);
                expect(batchTask.doneCount, 'doneCount').to.be.eq(0);
                expect(batchTask.errorCount, 'errorCount').to.be.eq(1);

                expect(batchTask.errorNo, 'errorNo').to.be.eq(50010);
                expect(batchTask.errorMessage, 'errorMessage').to.be.eq('请登录');
            }

        }

        after('', async () => {
            await gatherMQ.disconnect();
            await regainTaskRunner.stop();
        })
    })
})

// 从消息服务器阅读信息
async function readMessageFromServer(mq, queue) {
    const msgs = [];

    for (let i = 0; i < 4; i++) {
        const m = await mq.subscribeTask({ queue });
        if (_.isObject(m)) msgs.push(m)
    }

    return msgs;
}

function loadTaskFromFile(dir, fileName, batch) {
    const file = path.resolve(dir, fileName);
    const taskBody = JSON.parse(fs.readFileSync(file, 'utf8'));
    const { batchId, runCount, } = batch;
    return _.merge(taskBody, { task: { batchId, runCount, taskId: 1 } })
}