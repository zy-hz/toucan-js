/* eslint-disable no-undef */
const { GatherTaskCenter } = require('../../../libs/toucan-control-center');
const expect = require('chai').expect;
// 默认的配置
const DEFAULT_CONFIG = require('../../../libs/toucan-control-center/gather-task-center/config');

describe('[long][测试入口] - gather task service', () => {
    const startOptions = Object.assign(DEFAULT_CONFIG, {
        // 监听端口
        port: 1123,
        // 服务器的连接信息
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tc_gather_cc',
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
            }
        },
        // 任务来源
        taskSource: [
            {
                // 数据源的类型 file | db | fake | 其他特别的来源
                // 这些来源对应toucan-task-visitor 目录中的每个解析器
                dbType: 'file',
                // 数据访问器，可以是对象，或者字符串
                dbVisitor: 'd:/Works/大嘴鸟/toucan-js/.sample/ali.1688.detail.txt',
                urlFormat: 'http://detail.1688.com/offer/${0}.html',
            }
        ],
        // 一次发布3个任务
        batchPublishCount:3,
    });

    describe('start 测试', () => {

        before('', () => {
            GatherTaskCenter.start(startOptions);
        })

        after('', () => {
            //GatherTaskCenter.stop();
        })

        it('WorkUnitInfo 测试', () => {
            const { unitName } = GatherTaskCenter.unitInfo;
            expect(unitName).to.be.eq('GatherTaskService');
            expect(GatherTaskCenter.serviceName).to.be.eq('GatherTaskService');
        })
    })
})