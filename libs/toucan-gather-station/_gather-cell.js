//
// 采集单元
//
// 功能说明：
// 1. 设置自身的采集能力
// 2. 根据能力获取需要执行的采集任务
// 3. 一次一个，完成（失败）后再获取下一个任务
// 

const { ToucanWorkUnit } = require('../toucan-work-unit');
const { StatusCode, sleep } = require('../toucan-utility');
const { SubscribeGatherTaskJob } = require('../toucan-job');

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
        // 蜘蛛的选项
        spiderOptions = {},
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

        // 设置蜘蛛的选项
        this.spiderOptions = spiderOptions;

        // 设置拥有的采集技能
        this.skillKeys = skillKeys;

        // 采集单元所在的站点信息
        const { stationName, stationNo, stationIp } = unitInfo;
        this.stationInfo = { stationName, stationNo, stationIp };
    }

    // 启动采集单元
    async start() {
        this.processLog('启动...');
        this.__stopFlag = false;

        try {
            // 绑定需要订阅消息队列
            this.gatherMQ.bindTaskQueue(this.skillKeys)
            // 启动消息队列的连接
            //await this.gatherMQ.connect();

            // 创建订阅的作业，继承的基类可以重载该方法，实现自己的计划作业
            const sgtJob = this.createScheduleJob({ gatherMQ: this.gatherMQ, spiderOptions: this.spiderOptions, stationInfo: this.stationInfo });

            // 启动定时作业
            const scheduleRule = '* * * * * *'
            this.schedule = schedule.scheduleJob(scheduleRule, async () => {
                this.schedule.cancel();
                this.processLog('启动采集作业...');

                this.workInfo.unitStatus.updateStatus(StatusCode.actived);
                try {
                    const result = await sgtJob.do() || {};
                    this.workInfo.unitStatus.updateStatus(StatusCode.idle);

                    const {
                        // 作业的数量
                        jobCount,
                        // 两次作业的间隔
                        jobSpan,
                        // 执行的作业任务
                        task = {},
                    } = result;
                    // 作业的数量为0，表示没有可以执行的作业。这时让采集单元休息5秒
                    if (jobCount === 0) {
                        const sleepTime = jobSpan || 1000 * 5
                        this.processLog(`没有需要执行的作业，等待${Math.ceil(sleepTime / 1000)}秒后重试。`);
                        await sleep(sleepTime);
                    } else {
                        const { taskSpendTime } = task;
                        this.processLog(`执行${jobCount}次采集作业，用时${Math.ceil((taskSpendTime || 0) / 1000)}秒`);
                    }


                } catch (error) {
                    this.error('采集单元工作循环发生错误，等待60秒后继续工作', error)
                    // 作业发生错误时，采集单元的状态为挂起
                    // 注意：这些错误应该时系统没有办法处理的异常
                    this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
                    await sleep(1000 * 60);
                }

                // 检查是否停止工作
                if (this.__stopFlag) {
                    // 注意：不用断开采集消息队列，因为这个消息队列可能和其他人共用
                    // await this.gatherMQ.disconnect();

                    // 设置单元状态
                    this.workInfo.unitStatus.updateStatus(StatusCode.closed);
                } else {
                    // 重新启动定时计划
                    this.schedule.reschedule(scheduleRule);
                }
            });

            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.idle);
        }
        catch (error) {
            // 设置状态
            this.workInfo.unitStatus.updateStatus(StatusCode.suspend);
            this.processError('工作循环发生异常，工作中止。', error);
        }

    }

    async stop() {
        this.processLog(`停止中...`);
        // 设置关闭标记，开始关闭流程
        this.__stopFlag = true;

        while (!this.workInfo.unitStatus.isClosed) {
            await sleep(1000);
        }
        this.processLog(`已停止`);
    }

    createScheduleJob(options) {
        return new SubscribeGatherTaskJob(options);
    }

    // 记录采集单元的日志
    processLog(msg) {
        this.log(`${buildGatherCellId(this.unitInfo)} ${msg}`);
    }

    processError(msg, error) {
        this.error(`${buildGatherCellId(this.unitInfo)} ${msg}`, error);
    }
}

// 构建采集单元的标记
function buildGatherCellId(unitInfo) {
    return `编号[${unitInfo.unitId}]采集单元 [${unitInfo.unitName}] 第${unitInfo.unitNo}线程`;
}


module.exports = ToucanGatherCell;
