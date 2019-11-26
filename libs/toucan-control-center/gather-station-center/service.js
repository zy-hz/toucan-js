// 
// 采集站点管理服务
//

const { ToucanService } = require('../../toucan-service');

class GatherStationService extends ToucanService {

    constructor(options = {}) {
        super(Object.assign(
            {
                serviceName: 'GatherStationService',
            },
            options)
        );

        // 必须要调用该方法，将应用的目录设置到当前
        this.appPath = this.setAppPath(__dirname);
    }

}

module.exports = GatherStationService