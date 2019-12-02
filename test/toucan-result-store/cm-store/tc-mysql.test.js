/* eslint-disable no-undef */
const rsClass = require('../../../libs/toucan-result-store/cm-store/tc-mysql');
const path = require('path');

describe('[测试入口] - mysql', () => {
    const options = {
        // 数据库连接
        dbConnection: {
            host: '127.0.0.1',
            port: 3306,
            user: 'weapp',
            password: '123456',
            database: 'tctest_gather_result',
            charset: 'utf8'
        },
        // 指定表名,注意不能使用中横线
        tableName: 'ali_1688_detail',
        // 新建表，'' | day | week | month
        newTableWhen: 'day',
    }

    const rs = new rsClass(options);
    const msg = require(path.resolve(__dirname, '../sample', 'regain-result-1688-smaill.json'));

    before('', async () => {
        await rs.init(options);
    })

    after('', async () => {
        await rs.close();
    })

    it('save', async () => {
        await rs.save(msg);
    })
})