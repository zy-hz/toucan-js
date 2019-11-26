/* eslint-disable no-undef */
const {cronNextTime} = require('../../libs/toucan-utility');
const expect = require('chai').expect;

describe('[测试入口] - plan',()=>{
    it('cronNextTime',()=>{
        const s = '* 8-12 * * *';
        console.log(cronNextTime(s));
        
    })
})