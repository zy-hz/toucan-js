// 
// 采集站点管理服务
//

const ToucanService = require('../_toucan-service');

class GatherStationService extends ToucanService {

    constructor(options = {}) {
        super(Object.assign(
            {
                unitInfo: {            
                    // 单元名称
                    unitName: 'GatherStationService',
                }
            },
            options)
        );

    }
}

module.exports = GatherStationService