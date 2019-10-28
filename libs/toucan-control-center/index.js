//
// 各类服务的集合
//
// 每个子目录为一种服务
//
const ToucanService = require('./_toucan-service');
const GatherTaskCenter = require('./gather-task-center/_gather-task-center');
const GatherStationService = require('./gather-station-center/service');

module.exports = {
    ToucanService,
    GatherTaskCenter,
    GatherStationCenter: new GatherStationService()
};