/* eslint-disable no-undef */
const lib = require('rewire')('../../libs/toucan-app/auto-upgrade');
const buildExecFileWithPlatfomr = lib.__get__('buildExecFileWithPlatfomr');
const expect = require('chai').expect

describe('temp[测试入口] - auto upgrade', () => {

    it('buildExecFileWithPlatfomr', () => {
        expect(buildExecFileWithPlatfomr('cnpm')).eq('cnpm.cmd');
    })

})

describe('[demo]模拟运行', () => {
    const au = require('../../libs/toucan-app/auto-upgrade');

    // 自动更新的选项
    const options = {
        workDir: `C:\\Users\\zy\\Desktop\\deploy-test\\tc`,
        runAtOnce: true,
        // 每分钟运行一次
        scheduleRule: '* * * * *'
    }

    it('', () => {
        au.start(options)
    })
})