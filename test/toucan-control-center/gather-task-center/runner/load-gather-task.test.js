/* eslint-disable no-undef */
const runner = require('../../../../libs/toucan-control-center/gather-task-center/runners/load-gather-task');
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

describe('[测试入口] - load gather task', () => {
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
        ]
    }

    // 上传文件的路径
    const uploadPath = path.resolve(process.cwd(), options.taskSource[0].dbVisitor);

    // 任务模板
    const taskTemplate = {
        batchInfo: {
            batchName: '1688全量产品详情采集任务',
            batchComment: '1688_productid_20191114_145341',
            batchOwner: '施工',
            batchGroup: '大嘴鸟',
            batchTag: '预备 浙江',
            runPlan: '* 8-21 * * *',
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

    describe('联合测试', () => {
        beforeEach('', () => {
            prepareTaskFile('1688.v2', uploadPath);
        })

        // 该测试放在第一个
        it('init', async () => {
            await runner.init(options)
            expect(runner.uploadSource).have.lengthOf(1);
            expect(runner.uploadSource[0].dbPath).to.be.eq(uploadPath);
        })

        it('uploadTask', async () => {
            const task = Object.assign(taskTemplate, {
                sourceName: 'uploadTask',
                taskFile: path.resolve(uploadPath, '1688.v2.tsk'),
                contentFile: path.resolve(uploadPath, '1688.v2.txt')
                //taskFile: path.resolve('d:/Works/大嘴鸟/toucan-js/.sample/test/1688_productid_20191114_145341.tsk'),
                //contentFile: path.resolve('d:/Works/大嘴鸟/toucan-js/.sample/test/1688_productid_20191114_145341.txt')
            });

            const dbc = require('../../../../libs/toucan-control-center/db-center')(options.dbConnection);
            await runner.uploadTask(task, dbc);

            await dbc.destroy();

        })

        // 放在最后一个测试
        it('scheduleWork', async () => {
            await runner.scheduleWork(options);
        })
    })

    describe('temp 单任务测试', () => {
        beforeEach('', () => {
        })

        // 该测试放在第一个
        it('init', async () => {
            await runner.init(options)
            expect(runner.uploadSource).have.lengthOf(1);
            expect(runner.uploadSource[0].dbPath).to.be.eq(uploadPath);
        })

        it('uploadTask', async () => {
            const task = require('../sample/bodani.tsk.json');
            task.sourceName = 'require-bodani';
            const dbc = require('../../../../libs/toucan-control-center/db-center')(options.dbConnection);
            await runner.uploadTask(task, dbc);

            await dbc.destroy();

        })

    })
})

function prepareTaskFile(fileName, targetPath) {
    const srcFileName = path.resolve(__dirname, '../sample', fileName);
    const targetFileName = path.resolve(targetPath, fileName);

    fs.copyFileSync(srcFileName + '.tsk', targetFileName + '.tsk', fs.constants.COPYFILE_FICLONE);

    if (fs.existsSync(srcFileName + '.txt')) {
        fs.copyFileSync(srcFileName + '.txt', targetFileName + '.txt', fs.constants.COPYFILE_FICLONE);
    }
}