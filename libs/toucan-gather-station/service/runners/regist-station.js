/* eslint-disable require-atomic-updates */
//
// 到站点管理中心注册本站点
// 注册后，监视本机的网络地址，如果发生变化，立刻再次注册
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../../../toucan-work-unit');
const { StatusCode, sleep } = require('../../../toucan-utility');
const cache = require('../cache');
const { tcRegistOnRemote } = require('../../../web-api');

class RegistStationRunner extends ToucanWorkUnit {
    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async start(options = {}) {

        // 每7秒检查一次
        const scheduleRule = '*/5 * * * * *';

        // 启动定时作业
        this.schedule = schedule.scheduleJob(scheduleRule, async () => {
            // 取消定时计划
            this.schedule.cancel();
            // 设置工作状态为激活
            this.workInfo.unitStatus.updateStatus(StatusCode.actived);

            this.log('检查注册信息');

            try {
                const { remote, port } = options;

                if (cache.remoteServer === remote) {
                    // 表示已经注册
                    // 检查自己的地址变更
                    this.log(`已经在服务 ${cache.remoteServer} 上登记`);
                } else {
                    // 准备在服务器上注册
                    cache.remoteServer = await tcRegistOnRemote(remote);
                }

            }
            catch (error) {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
                // 
                this.error('RegistStationRunner工作异常', error);
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
}

module.exports = new RegistStationRunner();