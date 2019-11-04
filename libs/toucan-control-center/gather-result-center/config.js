// 
// 采集结果控制中心的默认启动项
//
module.exports = {
    // 监听端口
    port: 57703,
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
    // 结果队列
    resultMQ: {
        // 消息队列的类型
        mqType: 'rabbit',
        // 采集结果的队列
        fromQueue: ['toucan.gather.result.all'],
        // 结果队列的其他选项
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
        }
    }

}