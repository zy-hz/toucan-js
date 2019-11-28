/* eslint-disable no-undef */
const au = require('../../libs/toucan-app/auto-upgrade');
const lib = require('rewire')('../../libs/toucan-app/auto-upgrade');
const buildExecFileWithPlatfomr = lib.__get__('buildExecFileWithPlatfomr');
const expect = require('chai').expect

describe('[测试入口] - auto upgrade', () => {
    // 自动更新的选项
    const options = {
        workDir: `C:\\Users\\zy\\Desktop\\deploy-test\\tc`,
        runAtOnce: true,
        // 每分钟运行一次
        scheduleRule: '* * * * *'
    }

    it('[demo]', () => {
        au.start(options)
    })

    it('buildExecFileWithPlatfomr',()=>{
        expect(buildExecFileWithPlatfomr('cnpm')).eq('cnpm.cmd');
    })
})