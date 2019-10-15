const ToucanGatherStation = require('../../libs/toucan-gather-station/_gather-statioin-v1');
const gs = new ToucanGatherStation(__dirname + '/gsconfig.json');

// 初始化后，采集站自动启动
gs.init();