/* eslint-disable no-undef */
const { StatusGroup, StatusCode, sleep } = require('../../libs/toucan-utility');
const expect = require('chai').expect;
const _ = require('lodash');


describe('[测试入口] - StatusGroup', () => {

    it('', async () => {
        const theTime = _.now();
        const statusGroup = new StatusGroup([StatusCode.idle, StatusCode.actived, StatusCode.suspend], theTime);

        expect(statusGroup.statusCode, '默认为 idle').to.be.eq(StatusCode.idle);
        expect(statusGroup.isIdle, 'isIdle 为true').to.be.true;
        expect(statusGroup.isActived, 'isActived 为false').to.be.false;
        expect(statusGroup.isSuspend, 'isSuspend 为false').to.be.false;

        await sleep(100);
        const secondTime = _.now();
        statusGroup.updateStatus(StatusCode.actived, secondTime);

        expect(statusGroup.statusCode, '默认为 actived').to.be.eq(StatusCode.actived);
        expect(statusGroup.isIdle, 'isIdle false').to.be.false;
        expect(statusGroup.isActived, 'isActived 为true').to.be.true;
        expect(statusGroup.isSuspend, 'isSuspend 为false').to.be.false;

        expect(statusGroup.lastIdleChangeTime, '上次空闲变更时间为 theTime').to.be.eq(theTime);
        expect(statusGroup.lastActivedChangeTime, '上次激活变更时间为 secondTime').to.be.eq(secondTime);
        expect(statusGroup.idleDurationTime, 'idle 持续时间').to.be.eq(secondTime - theTime);

        await sleep(100);
        const thirdTime = _.now();
        statusGroup.updateStatus(StatusCode.idle, thirdTime);

        expect(statusGroup.lastIdleChangeTime, '上次空闲变更时间为 thirdTime').to.be.eq(thirdTime);
        expect(statusGroup.lastActivedChangeTime, '上次激活变更时间为 secondTime').to.be.eq(secondTime);
        expect(statusGroup.activedDurationTime, 'idle 持续时间').to.be.eq(thirdTime - secondTime);
    })
});