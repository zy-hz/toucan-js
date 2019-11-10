//
// runner的基类
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { StatusCode, sleep, getObjectClassName } = require('../toucan-utility');

class BaseRunner extends ToucanWorkUnit {
    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });

        this.className = getObjectClassName(this);
    }

    async start(options = {}) {

        // 每5秒检查一次
        const scheduleRule = options.scheduleRule || '*/5 * * * * *';

        // 启动定时作业
        this.schedule = schedule.scheduleJob(scheduleRule, async () => {
            // 取消定时计划
            this.schedule.cancel();
            // 设置工作状态为激活
            this.workInfo.unitStatus.updateStatus(StatusCode.actived);

            try {
                await this.scheduleWork(options)
            }
            catch (error) {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
                // 
                this.error('scheduleWork工作异常', error);
                await sleep(1000 * 60);
            }
            finally {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.idle);
                // 重新启动定时计划 - 等待下次工作
                this.schedule.reschedule(scheduleRule);
            }

        })

        // 设置状态
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
    }

    async stop() {
        // 关闭定时器
        if (!_.isNil(this.schedule)) this.schedule.cancel();
        // 更新工作状态
        this.workInfo.unitStatus.updateStatus(StatusCode.closed);
    }

    // 计划的工作
    async scheduleWork() {
        console.log('继承类的工作计划...');
    }

    // 添加类的标记
    log(...args) {
        super.log(`[${this.className}]`, args);
    }

    error(...args){
        super.error(`[${this.className}]`, args);
    }
}

module.exports = BaseRunner;