const ToucanGatherStation = require('../../libs/toucan-gather-station/_gather-statioin-v1');
const gs = new ToucanGatherStation(__dirname + '/gsconfig-elm-shoplist.json');
//const gs = new ToucanGatherStation(__dirname + '/gsconfig-1688-detail.json');

// 初始化后，采集站自动启动
gs.init();