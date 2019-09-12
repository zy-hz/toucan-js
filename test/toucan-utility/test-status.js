/* eslint-disable no-undef */
const { StatusGroup, StatusCode } = require('../../libs/toucan-utility');
const expect = require('chai').expect;
const _ = require('lodash');

describe('StatusGroup 测试 temp', () => {

    it('', () => {
        const theTime = _.now();
        const statusGroup = new StatusGroup([StatusCode.idle, StatusCode.actived, StatusCode.suspend], theTime);
        
        expect(statusGroup.status, '默认为 idle').to.be.eq(StatusCode.idle);
        expect(statusGroup.isIdle,'isIdle 为true').to.be.true;
        expect(statusGroup.isActived,'isActived 为false').to.be.false;
        expect(statusGroup.isSuspend,'isSuspend 为false').to.be.false;


        statusGroup.updateStatus(StatusCode.actived);

        expect(statusGroup.status, '默认为 actived').to.be.eq(StatusCode.actived);
        expect(statusGroup.isIdle,'isIdle false').to.be.false;
        expect(statusGroup.isActived,'isActived 为true').to.be.true;
        expect(statusGroup.isSuspend,'isSuspend 为false').to.be.false;
    })
});