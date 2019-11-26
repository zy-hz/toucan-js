// 
// 采集任务控制中心的默认启动项
//
module.exports = {
    // 监听端口
    port: 57702,
    // 服务器的连接信息
    dbConnection: {
        client: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        user: 'user',
        password: 'pass',
        database: 'tc_gather_cc',
        charset: 'utf8'
    },
    // 任务队列
    taskMQ: {
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
                // 测试时可以设置 noAck = false
                options: { noAck: true }
            }
        ]
    },
    // 任务来源
    taskSource: [
        {
            // 给来源指定一个名称
            sourceName:'',
            // 数据源的类型 file | db | fake | dir | 其他特别的来源
            // 这些来源对应toucan-task-visitor 目录中的每个解析器
            dbType: '',
            // 数据访问器，可以是对象，或者字符串
            dbVisitor: {},
            // 格式化，类似 http://detail.1688.com/offer/${0}.html ${0} 是从文件中读取的第一个参数
            urlFormat: '',
            // 读取数据源的缓存，保证数据源的数据只读取一次，如果设置false，每次从头读取的数据源
            enableCache: true,
        }
    ],
    // 批量发布的数量
    batchPublishCount: 1,
    // 批量接收的数量
    batchRegainCount:1,
    // 工作计划 - Cron风格定时器
    // 6个占位符从左到右分别代表：秒、分、时、日、月、周几
    // 参考：https://m.1688.com/offer/1164069979.html?sence=offerdetail_A_banner&spm-cnt=a26g8.7664810.download/vempty
    jobSchedule: {
        // 8点到21点，每10分，每5秒，
        publishGatherTask: '*/5 */10 8-21 * * *',
        // 每分钟的0秒
        regainGatherResult: '0 * * * * *',
        // 每分钟的0秒
        loadGatherTask: '0 * * * * *',
    }

}