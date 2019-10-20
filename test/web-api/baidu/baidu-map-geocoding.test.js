/* eslint-disable no-undef */
const expect = require('chai').expect;
const { BaiduMapGeocoding } = require('../../../libs/web-api');
const lib = require('rewire')('../../../libs/web-api/baidu/_baidu-map-geocoding');
const buildQueryUrl = lib.__get__('buildQueryUrl');
const fs = require('fs');

describe('baidu map geocording 测试', () => {
    it('buildQueryUrl ',()=>{

        const url = buildQueryUrl('/geocoder/v2/',{address:'百度大厦',output:'json',ak:'yourak'},'yoursk',false);
        expect(url).to.be.eq('http://api.map.baidu.com/geocoder/v2/?address=%E7%99%BE%E5%BA%A6%E5%A4%A7%E5%8E%A6&output=json&ak=yourak&sn=7de5a22212ffaa9e326444c75a58f9a0');
    })

    it('', async () => {
        const api = new BaiduMapGeocoding(getAppKey());
        const ok = await api.query('杭州意盛商务大厦');
        expect(ok.status).to.be.eq(0);
        
        const loc = ok.result.location;
        expect(loc.lat.toFixed(2)).to.be.eq('30.27');
        expect(loc.lng.toFixed(2)).to.be.eq('120.17');
    })
})

function getAppKey(){
    const fileName = `${process.cwd()}/.sample/baidu/appkey.json`;
    return JSON.parse(fs.readFileSync(fileName,'utf-8'));
}