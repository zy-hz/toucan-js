//
// runner的基类
//
const schedule = require('node-schedule');
const _ = require('lodash');

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { StatusCode, sleep } = require('../toucan-utility');

class BaseRunner extends ToucanWorkUnit{
    constructor() {
        // 工作单元的状态(默认关闭)
        const status = [StatusCode.closed, StatusCode.idle, StatusCode.actived, StatusCode.suspend]
        super({ status });
    }
}

module.exports = BaseRunner;