/* eslint-disable no-undef */
const expect = require('chai').expect;
const ServiceApp = require('../../libs/toucan-service/_service-app');
const { getResponse } = require('./index');

const serviceName = '我的测试服务'

describe('[测试入口] - toucan service app', () => {

    const app = new ServiceApp({ serviceName });
    const startOptions = {
        // 监听端口
        port: 1123,
        // 服务器的连接信息
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'test-mock',
        }
    }

    before('', () => {
        app.start(startOptions);
    })

    after('', () => {
        app.stop();
    })

    it('service基本信息测试', () => {
        expect(app.serviceName).to.be.eq(serviceName);
    })

    it('config 测试', async () => {
        const { body } = await getResponse('/config-test', {}, startOptions.port);
        const { code, result } = body;
        expect(code).to.be.eq(0);
        expect(result.initA).to.be.eq('a');

        const expectObj = {
            port: result.port,
            dbConnection: result.dbConnection
        }
        expect(expectObj, '和启动参数一致').to.be.eql(startOptions)
    })

    it('info 接口测试', async () => {
        const { body } = await getResponse('/info', {}, startOptions.port);

        const { code, result } = body;
        expect(code).to.be.eq(0);
        expect(result).to.be.eq('127.0.0.1');
    })

    it('testService 接口测试', async () => {
        const { body, statusCode } = await getResponse('/dev-test', {}, startOptions.port);
        expect(statusCode).to.be.eq(200);

        const { code, result } = body;
        expect(code).to.be.eq(0);
        expect(result).to.be.eq('I am ready! 我准备好了');
    })
})