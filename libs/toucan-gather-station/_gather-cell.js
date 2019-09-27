//
// 采集单元
//
// 功能说明：
// 1. 设置自身的采集能力
// 2. 根据能力获取需要执行的采集任务
// 3. 一次一个，完成（失败）后再获取下一个任务
// 

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { StatusCode } = require('../toucan-utility');
const SubscribeGatherTaskJob = require('../toucan-gather-cell/_job-subscribe-gather-task');

const _ = require('lodash');
const schedule = require('node-schedule');

class ToucanGatherCell extends ToucanWorkUnit {

    constructor({
        // 单元资料
        unitInfo = {},
        // 指定构造的时间
        theTime = _.now(),
        // 采集消息队列访问器
        gatherMQ,
        // 拥有的技能
        skillKeys = [],
    } = {}
    ) {
        // 设置默认的采集单元资料
        unitInfo = Object.assign(unitInfo, {
            unitName: unitInfo.unitName || 'GatherCell'
        });

        // ToucanWorkUnit构造器
        super({ unitInfo, theTime });

        // 设置采集消息队列
        this.gatherMQ = gatherMQ;

        // 设置拥有的采集技能
        this.skillKeys = skillKeys;
    }

    // 启动采集单元
    async start() {
        console.log(`${buildGatherCellId(this.unitInfo)} 启动...`);

        try {
            // 制定采集任务的消息队列
            this.gatherMQ.bindTaskQueue(this.skillKeys)
            // 启动消息队列的连接
            await this.gatherMQ.connect();

            // 订阅的作业
            const sgtJob = new SubscribeGatherTaskJob({ gatherMQ: this.gatherMQ });

            // 启动定时作业
            const scheduleRule = '*/3 * * * * *'
            this.schedule = schedule.scheduleJob(scheduleRule, async () => {
                this.schedule.cancel();

                this.workInfo.unitStatus.updateStatus(StatusCode.actived);
                await sgtJob.do();
                this.workInfo.unitStatus.updateStatus(StatusCode.idle);

                this.schedule.reschedule(scheduleRule);
            });

            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        }
        catch (error) {
            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
        }

    }

    async stop() {
        console.log(`${buildGatherCellId(this.unitInfo)} 停止`);
        // 关闭定时器
        if (!_.isNil(this.schedule)) this.schedule.cancel();
        // 断开采集消息队列
        await this.gatherMQ.disconnect();
    }

}

// 构建采集单元的标记
function buildGatherCellId(unitInfo) {
    return `采集单元 [${unitInfo.unitName}] 编号[${unitInfo.unitId} ${unitInfo.unitNo}]`
}

module.exports = ToucanGatherCell;
