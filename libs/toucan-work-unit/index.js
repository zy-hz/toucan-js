//
// 工作单元的基类
//
// 功能说明：
// 1. 以任务为工作内容
// 2. 设置工作单元资料 unitInfo
// 3. 纪录自身的运行状态 workInfo

const uuid = require('uuid/v1');
const _ = require('lodash');

class ToucanWorkUnit {

    constructor(unitInfo = {}) {

        // 单元资料，构造时确定，以后不会发生变化
        this.unitInfo = Object.assign({
            // 单元名称
            unitName: '',
            // 单元别名
            unitAlias: '',
            // 单元描述
            unitDescription: '',
            // 单元标识 ,默认为按时间戳生成的 uuid
            unitId: uuid(),
            // 单元编号
            unitNo: '',
            // 单元地址
            unitAddress: ''
        }, unitInfo);

        // 工作信息
        this.__work__ = {
            //   - 开始工作时间
            unitStartTime: _.now(),
            //   - 当前工作状态，激活中，空闲中，错误中
            unitStatus: 'idle',
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
            //   - 累计运行任务的时间
            totalUnitActiveTime: 0,
            //   - 累计空闲时间
            totalUnitIdleTime: 0,
            //   - 累计错误时间
            totalUnitErrorTime: 0,
            //   - 累计任务总数            
            totalExecuteTaskCount: 0,
            //   - 累计成功任务数量
            totalDoneTaskCount: 0,
            //   - 累计失败任务数量
            totalErrorTaskCount: 0,
        };

    }

    get workInfo() {
        const unitDuratioinTime = _.now() - this.__work__.unitStartTime;
        return Object.assign(this.__work__, { unitDuratioinTime });
    }

}

module.exports = ToucanWorkUnit;