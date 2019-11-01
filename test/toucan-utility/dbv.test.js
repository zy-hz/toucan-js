/* eslint-disable no-undef */
const { DbVisitor } = require('../../libs/toucan-utility');

describe('[测试入口] - dbv', () => {
    const dbconn = {
        host: '127.0.0.1',
        port: 3306,
        user: 'weapp',
        password: '123456',
        database: 'test-mock',
    }
    const dbv = new DbVisitor(dbconn);
    const tbName = 'mytab';

    after('',async ()=>{
        await dbv.close();
    })

    describe('execSql 测试', () => {

        it('sql command 测试', async () => {
            await dbv.execSql(`CREATE TABLE IF NOT EXISTS ${tbName} (
                \`col1\` INT NULL
            )`);
            await dbv.execSql(`select * from ${tbName}`);
        })
    })

})