/* eslint-disable require-atomic-updates */
//
// 到站点管理中心注册本站点
// 注册后，监视本机的网络地址，如果发生变化，立刻再次注册
//
const { ToucanRunner } = require('../../../toucan-service');
const cache = require('../cache');
const tcSDK = require('../../../toucan-sdk');
const _ = require('lodash');

class RegistMeRunner extends ToucanRunner {

    async scheduleWork(options = {}) {
        const { remote, port } = options;

        if (cache.remoteServer === remote && !_.isEmpty(cache.stationKey)) {
            // 已经注册，开始执行更新过程
            await this.updateProcess(remote, port);

            // 同步采集站点的配置
            await this.syncProcess(remote, port);
        } else {
            // 没有在服务上注册，开始执行注册过程
            await this.registProcess(remote, port);

            // 同步采集站点的配置
            await this.syncProcess(remote, port);
        }
    }

    async registProcess(remote, port) {
        // 准备在服务器上注册
        const { code, result, error } = await tcSDK.registMe(remote, { listenPort: port });
        if (code === 0) {
            this.log(`在管理中心 ${remote} 上注册成功，分配站点编号[${stationId}]`);

            // 保存到缓存
            const { stationId, stationKey } = result;
            cache.set({ stationId, stationKey, remoteServer: remote });

        } else if (code === -1) {
            this.error(`在管理中心 ${remote} 上注册失败。${error}`);
        }
    }

    async updateProcess(remote, port) {

    }

    async syncProcess(remote, port) {

    }

}

module.exports = new RegistMeRunner();