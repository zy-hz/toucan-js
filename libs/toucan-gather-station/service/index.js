//
// 采集站点的监听服务
//

const { ToucanService } = require('../../toucan-service');
const cache = require('./cache');
const path = require('path');

class StationListener extends ToucanService {
    constructor(options = {}) {
        super(Object.assign(
            {
                serviceName: 'StationListener',
            },
            options)
        );

        // 必须要调用该方法，将应用的目录设置到当前
        this.appPath = this.setAppPath(__dirname);

        // 初始化缓存
        this.initCache();
    }

    initCache() {
        const cacheFileName = path.resolve(this.appPath.cachePath, 'gs-service-cache.json');
        cache.init(cacheFileName);
    }

}

module.exports = StationListener;