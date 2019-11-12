/* eslint-disable no-undef */
const runner = require('../../../../libs/toucan-control-center/gather-task-center/runners/regain-gather-result');


describe('[测试入口] - regain gather result runner', () => {

    after('', async () => {
        await runner.stop();
    })

    it('start', async () => {
        const taskMQ = {
            // 消息队列的类型
            mqType: 'rabbit',
            // 发布采集任务的交换机
            exchangeName: 'toucan.gather.task',
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
                    // 设置为false ,保证不从服务器删除数据
                    options: { noAck: false }
                }
            ]
        }
        const jobSchedule = { regainGatherResult: '*/2 * * * * *' }
        await runner.start({ taskMQ, jobSchedule, batchRegainCount: 2 });
    })


})