/* eslint-disable no-undef */
//
// 机器信息
//
const { getMachineInfo } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - macine', () => {

    it('getMachineInfo', async () => {
        const mi = await getMachineInfo();
        expect(mi.networkAddress).have.length(2);        
    })
})