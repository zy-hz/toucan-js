/* eslint-disable no-undef */
// 载入的测试
const expect = require('chai').expect;

describe('工具库的入口测试',()=>{

    it('load utility 测试',()=>{
        const utils = require('../../libs/toucan-utility');

        expect(typeof utils.isClass,'isClass 载入').to.be.eq('function');
        expect(typeof utils.isEqualString,'isEqualString 载入').to.be.eq('function');
        expect(typeof utils.sleep,'sleep 载入').to.be.eq('function');
        expect(typeof utils.batchLoadModule,'batchLoadModule 载入').to.be.eq('function');

        expect(utils.isEqualString('abc','Abc',true),'isEqualString 比较测试').to.be.true;

    });
});