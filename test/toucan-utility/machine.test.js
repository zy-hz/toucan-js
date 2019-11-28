/* eslint-disable no-undef */
//
// 机器信息
//
const { getMachineInfo, getPlatformType,isWindowPlatform } = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - macine', () => {

    it('getMachineInfo', async () => {
        const mi = await getMachineInfo();
        expect(mi.networkAddress).have.length(2);
        expect(mi.nodeVersion).to.be.eq('v10.15.1');
        expect(mi.libVersion > '1.0.0').is.true;
    })

    it('getPlatformType', () => {
        const pt = getPlatformType();
        expect(pt).eq('win32')
    })

    it('isWindowPlatform',()=>{
        expect(isWindowPlatform()).is.true;
    })
})