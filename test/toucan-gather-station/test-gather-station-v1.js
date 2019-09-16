/* eslint-disable no-undef */
const ToucanGatherStation = require('../../libs/toucan-gather-station');
const expect = require('chai').expect;
const _ = require('lodash');

describe('GatherStationV1 测试 temp', () => {
    it('', () => {
        const gs = new ToucanGatherStation();
        expect(_.isNil(gs)).to.be.false;

    });
});