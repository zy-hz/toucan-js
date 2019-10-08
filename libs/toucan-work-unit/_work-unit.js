//
// 工作单元的基类
//
// 功能说明：
// 1. 以任务为工作内容
// 2. 设置工作单元资料 unitInfo
// 3. 纪录自身的运行状态 workInfo

const _ = require('lodash');
const { StatusGroup, StatusCode } = require('../toucan-utility');
const { ToucanLogger } = require('./_logger');

class ToucanWorkUnit extends ToucanLogger {

    constructor({ unitInfo = {}, theTime = _.now(), status = [StatusCode.idle, StatusCode.actived, StatusCode.suspend] } = {}) {
        super();
        
        // 单元资料，构造时确定，以后不会发生变化
        this.unitInfo = Object.assign({
            // 单元名称
            unitName: '',
            // 单元别名
            unitAlias: '',
            // 单元描述
            unitDescription: '',
            // 单元标识，注意：不能使用自动uuid
            unitId: '',
            // 单元编号
            unitNo: '',
            // 单元地址
            unitAddress: ''
        }, unitInfo);

        // 工作信息
        this.__work__ = {
            //   - 工作单元的状态
            unitStatus: new StatusGroup(status, theTime),
            //   - 开始工作时间
            unitStartTime: theTime,
            //   - 上个运行任务的开始时间
            lastTaskBeginTime: 0,
            //   - 上个运行任务的结束时间
            lastTaskEndTime: 0,
            //   - 上个运行任务的持续时间
            lastTaskSpendTime: 0,
            //   - 上个运行任务的是否成功
            lastTaskSuccessful: false,
            //   - 上个运行任务的唯一标识
            lastTaskId: '',
            //   - 上个运行任务的描述
            lastTaskDescription: '',
            //   - 累计工作时间
            unitDuratioinTime: 0,
            //   - 累计任务总数            
            totalExecuteTaskCount: 0,
            //   - 累计成功任务数量
            totalDoneTaskCount: 0,
            //   - 累计失败任务数量
            totalErrorTaskCount: 0,
        };

    }

    get workInfo() {
        const theNow = _.now();

        // 计算累计工作时间
        const unitDuratioinTime = theNow - this.__work__.unitStartTime;
        // 计算单元的工作状态
        this.__work__.unitStatus.updateStatus(this.__work__.unitStatus.statusCode, theNow);

        return Object.assign(this.__work__, { unitDuratioinTime });
    }

}

module.exports = {ToucanWorkUnit};