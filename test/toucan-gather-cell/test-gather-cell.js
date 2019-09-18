/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');
const { sleep, StatusCode } = require('../../libs/toucan-utility');
const ToucanGatherCell = require('../../libs/toucan-gather-cell');

describe('ToucanGatherCell 构造测试', () => {

    it('workInfo 测试', async () => {
        // 固定时间
        const theTime = _.now()
        const gatherCell = new ToucanGatherCell({ unitInfo: { unitNo: 'N1988' } });
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
});

describe('ToucanGatherCell 启动测试', () => {

    it('单个RabbitMQ启动 temp', async () => {

    });

    it('多个RabbitMQ启动', async () => {

    });

    it('共享RabbitMQ启动', async () => {

    });
});

