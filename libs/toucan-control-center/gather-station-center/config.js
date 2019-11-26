// 
// 采集站点控制中心的默认启动项
//
module.exports = {
    // 监听端口
    port: 57701,
    // 服务器的连接信息
    dbConnection: {
        client: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        user: 'user',
        password: 'pass',
        database: 'tc_gather_cc',
        charset: 'utf8'
    }
}