//
// 启动任务中心

const GatherTaskCenter = require('../../libs/toucan-control-center/_gather-task-center');

const gtc = new GatherTaskCenter(__dirname + '/taskcenter.config.json' );
gtc.init();