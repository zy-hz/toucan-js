/* eslint-disable require-atomic-updates */
//
// 检查站点配置，发现变更后，重启采集站点
//
const _ = require('lodash');
const { ToucanRunner } = require('../../../toucan-service');

const cache = require('../cache');
const ToucanGatherStation = require('../../index');

class MaintainStationRunner extends ToucanRunner {

    async scheduleWork() {

        // 如果没有启动，有日志提示
        if (_.isNil(this._gs)) this.log('本站点还未启动，等待管理中心激活...');

        // 读取配置
        if (cache._stationConfigChanged || false) {
            this.log('采集站点配置变更，准备重新启动采集站点...');

            // 先停止
            if (!_.isNil(this._gs)) await this._gs.stop();
            // 构建采集站点
            this._gs = new ToucanGatherStation(cache._stationConfig);
            // 初始化后，采集站自动启动
            await this._gs.init();

            // 清除变更标记 - 表示变更完成
            cache._stationConfigChanged = false;
        }

    }

}

module.exports = new MaintainStationRunner();