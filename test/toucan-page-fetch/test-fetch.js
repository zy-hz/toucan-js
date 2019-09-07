/* eslint-disable no-undef */
const expect = require('chai').expect;

const ToucanPageFetch = require('../../libs/toucan-page-fetch/index');
const pageFetch = new ToucanPageFetch()

describe('page fetch 测试', () => {

    it('do www.qq.com 测试', async () => {
        let res = await pageFetch.do('www.qq.com');
        expect(res,'页面抓取结果不能为空').to.be.not.empty;
    });


})