/* eslint-disable no-undef */
const runner = require('../../../../libs/toucan-control-center/gather-task-center/runners/publish-gather-task');

describe('[测试入口] - publish gather task runner', () => {
    // 启动的选项
    const options = {
        // 数据库连接
        dbConnection: {
            client: 'mysql',
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tc_gather_cc',
            charset: 'utf8'
        },
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
                vhost: '/',
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

    before('', async () => {
        await runner.init(options);
    })

    after('', async () => {
        await runner.stop();
    })

    it('scheduleWork', async () => {
        await runner.scheduleWork(options);
    })
})