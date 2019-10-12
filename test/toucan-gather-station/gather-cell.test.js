/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const moment = require('moment');
const { sleep, StatusCode } = require('../../libs/toucan-utility');
const ToucanGatherCell = require('../../libs/toucan-gather-station/_gather-cell');
const mqFactory = require('../../libs/toucan-message-queue');

describe('ToucanGatherCell', () => {

    describe('构造', () => {
        it('workInfo 测试 ', async () => {
            // 固定时间
            const theTime = _.now()
            const gatherCell = new ToucanGatherCell({ unitInfo: { unitNo: 'N1988' }, theTime });
            const { unitInfo, workInfo } = gatherCell;

            expect(_.isNil(gatherCell), '对象不能为空').to.be.false;
            expect(_.isNil(unitInfo), '单元资料对象不能为空').to.be.false;
            expect(unitInfo.unitName, '单元名称为 GatherCell').to.be.eq('GatherCell');
            expect(unitInfo.unitNo, '单元编号为 N1988').to.be.eq('N1988');

            expect(_.isNil(workInfo), '工作信息不能为空').to.be.false;
            expect(workInfo.unitStartTime, '单元启动时间 = theTime').to.be.eq(theTime);

        });

        it('unitStatus 测试', async () => {
            const gatherCell = new ToucanGatherCell();

            // 初始化
            let unitStatus = gatherCell.workInfo.unitStatus;
            expect(unitStatus.statusCode, '初始状态为 idle').to.be.eq(StatusCode.idle);
            expect(unitStatus.isIdle, 'idle 为true').to.be.true;
            expect(unitStatus.isActived, 'actived 为false').to.be.false;
            expect(unitStatus.isSuspend, 'suspend 为false').to.be.false;

            // 测试启动时间
            // workInfo对象，需要重新取值
            await sleep(100);
            expect(gatherCell.workInfo.unitDuratioinTime, '工作单元启动时间 大于90').to.be.greaterThan(90);
            expect(gatherCell.workInfo.unitStatus.idleDurationTime, '空闲时间 大于90').to.be.greaterThan(90);
            expect(gatherCell.workInfo.unitStatus.activedDurationTime, '激活时间 = 0').to.be.eq(0);
            expect(gatherCell.workInfo.unitStatus.suspendDurationTime, '挂起时间 = 0').to.be.eq(0);

        });

        it('skillKeys 测试1个技能', () => {
            const skillKeys = ['cm.http'];
            const gatherCell = new ToucanGatherCell({ skillKeys });
            expect(gatherCell.skillKeys).to.be.eq(skillKeys);
        })
    });

    describe('[long]启动停止', () => {
        const skillKeys = ['cm.http'];

        it('单个RabbitMQ启动', async () => {
            const gatherMQ = mqFactory.createGatherMQ('rabbit');
            const gc = new ToucanGatherCell({ unitInfo: { unitName: '单个RabbitMQ' }, gatherMQ, skillKeys });

            await gc.start();
            await gc.stop();

            await gatherMQ.disconnect();
        });

        it('多个RabbitMQ启动', async () => {
            const mqv1 = mqFactory.createGatherMQ('rabbit');
            const gc1 = new ToucanGatherCell({ unitInfo: { unitName: '多个RabbitMQ-1' }, gatherMQ: mqv1 });
            await gc1.start();

            const mqv2 = mqFactory.createGatherMQ('rabbit');
            const gc2 = new ToucanGatherCell({ unitInfo: { unitName: '多个RabbitMQ-2' }, gatherMQ: mqv2 });
            await gc2.start();

            await gc1.stop();
            await gc2.stop();

            await mqv1.disconnect();
            await mqv2.disconnect();
        });

        it('共享RabbitMQ启动', async () => {

            const gatherMQ = mqFactory.createGatherMQ('rabbit');
            const gc1 = new ToucanGatherCell({ unitInfo: { unitName: '多个RabbitMQ-1' }, gatherMQ });
            await gc1.start();

            const gc2 = new ToucanGatherCell({ unitInfo: { unitName: '多个RabbitMQ-2' }, gatherMQ });
            await gc2.start();

            await gc1.stop();
            await gc2.stop();

            await gatherMQ.disconnect();
        });
    });

    describe('work loop zero job', () => {
        const skillKeys = ['cm.http'];
        const gatherMQ = mqFactory.createGatherMQ('rabbit');

        const waitSecond = 1000 * 10;
        const jobSpan = 1000 * 3;
        // 全局计数器
        let runCount = 0;

        class TestGatherCell extends ToucanGatherCell {
            createScheduleJob() {
                return {
                    do() {
                        runCount = runCount + 1;
                        console.log(moment().format('HH:mm:ss'), `[${runCount}]find zero job ...`);
                        return { jobCount: 0, jobSpan };
                    }
                }
            }
        }

        after(async () => {
            await gatherMQ.disconnect();
        });

        it('', async () => {
            const gc = new TestGatherCell({ unitInfo: { unitName: 'zero job 测试' }, gatherMQ, skillKeys });
            await gc.start();

            await sleep(waitSecond);
            await gc.stop();

            expect(runCount, '运行次数').to.be.eq(Math.floor(waitSecond / 1000 / (jobSpan / 1000 + 1)) + 1);
        });
    });

    // 由本地文件提供任务的采集
    describe('fileMQ temp', () => {
        const queueName = 'ali.1688.detail';
        const skillKeys = [`${queueName}`];
        const fileMQOptions = {
            gatherTaskQueue: [{
                queueName,
                srcFilePath: `${process.cwd()}/.sample/ali.1688.detail_s.txt`,
                urlFormat: 'http://detail.1688.com/offer/{$0}.html',
                reload: true
            }]
        };

        it('', async () => {
            const gatherMQ = mqFactory.createGatherMQ('file', fileMQOptions);
            const gc = new ToucanGatherCell({ gatherMQ, skillKeys });

            await gc.start();
        })
    });
});


