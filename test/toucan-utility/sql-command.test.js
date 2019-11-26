/* eslint-disable no-undef */
const { verifySqlPermit } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - sql command', () => {
    describe('verifySqlPermit 测试', () => {
        const sqlCommand = 'Delete from xxx where 123=113';

        it('disable 测试', () => {
            try {
                verifySqlPermit(sqlCommand, { disableDelete: true })
                expect.fail('期望抛出异常');
            }
            catch (error) {
                const { message, source } = error;
                expect(message).to.be.eq('delete命令被禁止执行');
                expect(source).to.be.eq(sqlCommand);
            }
        })
    })
})