/* eslint-disable no-undef */
const au = require('../../libs/toucan-app/auto-upgrade');

describe('[测试入口] - auto upgrade', () => {
    // 自动更新的选项
    const options = {
        workDir: `C:\\Users\\zy\\Desktop\\deploy-test\\tc`,
        runAtOnce: true,
        // 每隔3秒运行
        scheduleRule: '*/20 * * * * *'
    }

    it('', () => {
        au.start(options)
    })
})