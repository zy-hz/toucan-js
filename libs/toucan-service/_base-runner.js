//
// runner的基类
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { StatusCode, sleep, getObjectClassName, cronNextTime } = require('../toucan-utility');

class BaseRunner extends ToucanWorkUnit {
    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });

        this.className = getObjectClassName(this);
        // 默认的工作计划
        this.defaultscheduleRule = '*/5 * * * * *';
        // 显示下次计划时间
        this.showNextSchedule = {
            enable: false,
            title: '下次工作时间：'
        }
    }

    // 初始化
    async init(options = {}) {
        // 继承类，添加初始化代码
    }

    async start(options = {}) {

        // 启动前的初始化
        const myOptions = await this.init(options) || options;

        // 是否需要立刻运行
        if (options.runAtOnce) {
            try {
                await this.scheduleWork(myOptions);
            }
            catch (error) {
                this.error('runAtOnce 工作异常', error);
            }
        }

        // 每5秒检查一次
        let scheduleRule = myOptions.scheduleRule || this.defaultscheduleRule;
        this.logNextSchedule(this.showNextSchedule, scheduleRule);

        // 启动定时作业
        this.schedule = schedule.scheduleJob(scheduleRule, async () => {
            // 取消定时计划
            this.schedule.cancel();
            // 设置工作状态为激活
            this.workInfo.unitStatus.updateStatus(StatusCode.actived);

            try {
                const result = await this.scheduleWork(myOptions);

                // 重新设置工作计划
                const { rescheduleRule } = result || {};
                if (!_.isEmpty(rescheduleRule)) scheduleRule = rescheduleRule
            }
            catch (error) {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
                // 
                this.error('scheduleWork工作异常，暂停60秒后重试', error);
                await sleep(1000 * 60);
            }
            finally {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.idle);
                // 重新启动定时计划 - 等待下次工作
                this.schedule.reschedule(scheduleRule);
            }
            this.logNextSchedule(this.showNextSchedule, scheduleRule);
        })

        // 设置状态
        this.workInfo.unitStatus.updateStatus(StatusCode.idle);
    }

    async stop() {
        this.log('关闭定时器');
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

    error(...args) {
        super.error(`[${this.className}]`, args);
    }

    logNextSchedule(options = {}, rule) {
        if (!options.enable) return;

        this.log(`${options.title}${cronNextTime(rule)}`);
    }
}

module.exports = BaseRunner;