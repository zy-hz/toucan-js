//
// 采集结果服务
//

const { ToucanService } = require('../../toucan-service');

class GatherResultService extends ToucanService {

    constructor(options = {}) {
        super(Object.assign(
            {
                serviceName: 'GatherResultService',
            },
            options)
        );

        // 必须要调用该方法，将应用的目录设置到当前
        this.appPath = this.setAppPath(__dirname);
    }

}

module.exports = GatherResultService