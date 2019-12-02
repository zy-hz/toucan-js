/* eslint-disable require-atomic-updates */
//
// 到站点管理中心注册本站点
// 注册后，监视本机的网络地址，如果发生变化，立刻再次注册
//
const { ToucanRunner } = require('../../../toucan-service');
const cache = require('../cache');
const tcSDK = require('../../../toucan-sdk');
const _ = require('lodash');
// 自动更新
const au = require('../../../toucan-app/auto-upgrade');

class RegistMeRunner extends ToucanRunner {

    constructor() {
        super();

        // 注册全局通知
        au.addRestartListener(this.onRestartApp.bind(this));
    }

    async scheduleWork(options = {}) {

        const { remote, port } = options;
        let result = false;
        if (cache.remoteServer === remote && !_.isEmpty(cache.stationKey)) {
            // 已经注册，开始执行更新过程
            await this.updateProcess(remote, port);

            // 同步采集站点的配置
            result = await this.syncProcess(remote, port);
        } else {
            // 没有在服务上注册，开始执行注册过程
            await this.registProcess(remote, port);

            // 同步采集站点的配置
            result = await this.syncProcess(remote);
        }

        // 如果工作成功，设置计划间隔为5分钟,如果失败7秒后重试
        return { rescheduleRule: result ? '*/5 * * * *' : '*/7 * * * * *' };
    }

    async registProcess(remote, port) {

        // 准备在服务器上注册
        const { code, result, error } = await tcSDK.registMe(remote, { listenPort: port });
        if (code === 0) {
            const { stationId, stationKey } = result;
            this.log(`在管理中心 ${remote} 上注册成功，分配站点编号[${stationId}]`);

            // 保存到缓存
            cache.set({ stationId, stationKey, remoteServer: remote });

        } else if (code === -1) {
            this.error(`在管理中心 ${remote} 上注册失败。${error}`);
        }

        return code === 0;
    }

    async updateProcess(remote, port) {
        // 准备在服务器上更新
        const { code, result, error } = await tcSDK.registMe(remote, { listenPort: port, stationKey: cache.stationKey });

        if (code === 0) {
            const { stationKey } = result;
            this.log(`在管理中心 ${remote} 上更新成功。`);

            // 保存到缓存
            cache.set({ stationKey });

        } else if (code === -1) {
            this.error(`在管理中心 ${remote} 上更新失败。${error}`);
            // 尝试修复错误
            this.fixProcess(error);
        }

        return code === 0;
    }

    async syncProcess(remote) {
        // 从服务器上读取配置
        const { code, result, error } = await tcSDK.syncStationConfig(remote, { stationKey: cache.stationKey });
        if (code === 0) {
            this.log(`从管理中心 ${remote} 上同步配置成功。`);

            // 配置有变化
            if (!_.isEqual(cache._stationConfig, result)) {
                // 保存到缓存
                cache.set({ _stationConfig: result, _stationConfigChanged: true });
            }
        } else if (code === -1) {
            this.error(`从管理中心 ${remote} 上同步配置失败。${error}`);
        }

        return code === 0;
    }

    // 尝试修复错误
    async fixProcess(error) {

        const msg = _.isObject(error) ? error.toString() : error;
        if (/主机\[.*?\]未注册/im.test(msg)) {
            // 尝试清除本地缓存
            this.log('启动错误修复过程 -> 清除本地缓存');
            cache.clear();
        }

    }

    // 当准备重启的时候
    async onRestartApp() {
        await super.stop();
    }
}

module.exports = new RegistMeRunner();