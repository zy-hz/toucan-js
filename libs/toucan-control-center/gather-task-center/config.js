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
        resultQueue:[

        ]
    },
    // 任务来源
    taskSource: [
        {
            // 数据源的类型 file | db | fake | 其他特别的来源
            // 这些来源对应toucan-task-visitor 目录中的每个解析器
            dbType: '',
            // 数据访问器，可以是对象，或者字符串
            dbVisitor: {},
            // 格式化，类似 http://detail.1688.com/offer/${0}.html ${0} 是从文件中读取的第一个参数
            urlFormat:'',
            // 读取数据源的缓存，保证数据源的数据只读取一次，如果设置false，每次从头读取的数据源
            enableCache:true,
        }
    ],
    // 批量发布的数量
    batchPublishCount:1

}