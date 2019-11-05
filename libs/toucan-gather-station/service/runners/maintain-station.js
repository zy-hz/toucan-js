/* eslint-disable require-atomic-updates */
//
// 检查站点配置，发现变更后，重启采集站点
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../../../toucan-work-unit');
const { StatusCode, sleep } = require('../../../toucan-utility');
const cache = require('../cache');
const ToucanGatherStation = require('../../index');

class MaintainStationRunner extends ToucanWorkUnit {

    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }

    async start(options = {}) {

        // 每5秒检查一次
        const scheduleRule = '*/5 * * * * *';

        // 启动定时作业
        this.schedule = schedule.scheduleJob(scheduleRule, async () => {
            // 取消定时计划
            this.schedule.cancel();
            // 设置工作状态为激活
            this.workInfo.unitStatus.updateStatus(StatusCode.actived);
            
            // 如果没有启动，有日志提示
            if(_.isNil(this._gs)) this.log('本站点还未启动，等待管理中心激活...');

            try {
                // 读取配置
                if (cache.isConfigChanged || false) {
                    this.log('采集站点配置变更，准备重新启动采集站点...');

                    // 先停止
                    if (!_.isNil(this._gs)) await this._gs.stop();
                    // 构建采集站点
                    this._gs = new ToucanGatherStation(cache.config);
                    // 初始化后，采集站自动启动
                    await this._gs.init();

                    // 清除变更标记 - 表示变更完成
                    cache.isConfigChanged = false;
                }
            }
            catch (error) {
                // 设置状态
                this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
                // 
                this.error('MaintainStationRunner工作异常', error);
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

module.exports = new MaintainStationRunner();