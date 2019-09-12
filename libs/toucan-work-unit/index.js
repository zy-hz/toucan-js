//
// 工作单元的基类
//
// 功能说明：
// 1. 以任务为工作内容
// 2. 设置工作单元资料
//   - 单元名称
//   - 单元别名
//   - 单元描述
//   - 单元标识
//   - 单元编号
//   - 单元地址
// 3. 纪录自身的运行状态
//   - 开始工作时间
//   - 当前工作状态，激活中，空闲中，错误中
//   - 当前运行任务的开始时间
//   - 当前运行任务的描述
//   - 当前运行任务的持续时间
//   - 上个运行任务的开始时间
//   - 上个运行任务的描述
//   - 上个运行任务的持续时间
//   - 上个运行任务的是否成功
//   - 累计工作时间
//   - 累计运行任务的时间
//   - 累计空闲时间
//   - 累计任务总数，成功数量，失败数量

const uuid = require('uuid/v1');
class ToucanWorkUnit {

    constructor(unitInfo = {}) {
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
    }
}

module.exports = ToucanWorkUnit;