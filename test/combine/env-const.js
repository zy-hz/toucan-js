// 测试环境的常数
const _ = require('lodash');

// 数据库连接
const connDbCenter = {
    client: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    user: 'weapp',
    password: '123456',
    database: 'tctest_gather_cc',
    charset: 'utf8mb4'
}

// 结果数据库
const connResultCenter = {
    host: '127.0.0.1',
    port: 3306,
    user: 'weapp',
    password: '123456',
    database: 'tctest_gather_result',
    charset: 'utf8mb4'
}

// rabbit消息队列
const rabbitMQ = {
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
}

// 采集情报站信息
const gatherStationInfo = {
    stationName: 'combine模拟器',
    stationNo: '001',
    stationIp: '127.0.0.1'
}

const resultQueueName = 'combine.test.result';
const resultTableName = 'combine_test';

const resultQueue4Dir = {
    queue: resultQueueName,
    outDir: '../output/combine.result',
}

const resultQueue4Mysql = {
    queue: resultQueueName,
    storeType: 'tc-mysql',
    storeOptions: {
        // 数据库连接
        dbConnection: connResultCenter,
        // 指定表名,注意不能使用中横线
        tableName: resultTableName,
        // 新建表，'' | day | week | month
        newTableWhen: 'day',
    }
}



// 使用deepclone,保证调用方不会修改这个参数
module.exports =
    {
        resultQueueName,
        resultTableName,
        connDbCenter: _.cloneDeep(connDbCenter),
        connResultCenter: _.cloneDeep(connResultCenter),
        rabbitMQ: _.cloneDeep(rabbitMQ),
        gatherStationInfo: _.cloneDeep(gatherStationInfo),
        resultQueue4Dir: _.cloneDeep(resultQueue4Dir),
        resultQueue4Mysql: _.cloneDeep(resultQueue4Mysql),

    }