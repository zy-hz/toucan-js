//
// 各类服务的集合
//
// 每个子目录为一种服务
//
const ToucanService = require('../toucan-service');
const GatherStationService = require('./gather-station-center/service');
const GatherTaskService = require('./gather-task-center/service');

module.exports = {
    ToucanService,
    GatherStationService,
    GatherTaskCenter: new GatherTaskService(),
    GatherStationCenter: new GatherStationService()
};