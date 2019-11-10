/* eslint-disable require-atomic-updates */
//
// 到站点管理中心注册本站点
// 注册后，监视本机的网络地址，如果发生变化，立刻再次注册
//
const { ToucanRunner } = require('../../../toucan-service');
const cache = require('../cache');
const tcSDK = require('../../../toucan-sdk');

class RegistMeRunner extends ToucanRunner {

    async scheduleWork(options = {}) {
        const { remote, port } = options;

        if (cache.remoteServer === remote) {
            // 表示已经注册
            // 检查自己的地址变更
            this.log(`已经在服务 ${cache.remoteServer} 上登记`);
        } else {
            // 准备在服务器上注册
            const { code, result, error } = await tcSDK.registMe(remote, { listenPort: port });
            if (code === 0) {
                const { stationId, stationKey } = result;
                this.log(`在管理中心 ${remote} 上注册成功，分配站点编号[${stationId}]`);

            } else if (code === -1) {
                this.error(`在管理中心 ${remote} 上注册失败。${error}`);
            }

        }
    }

}

module.exports = new RegistMeRunner();