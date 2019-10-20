//
// 百度地理信息接口
//

const _ = require('lodash');
const request = require('superagent');
const { md5 } = require('../../../libs/toucan-utility');
const BAIDU_MAP_API_HOST = 'http://api.map.baidu.com';

class BaiduMapGeocoding {

    constructor(options = {}) {
        const { ak, sk,
            // gcj02ll（国测局坐标）
            // bd09mc（百度墨卡托坐标）
            // bd09ll（百度经纬度坐标）
            ret_coordtype = 'gcj02ll',
            // json或xml
            output = 'json' } = options;

        this.ak = ak;
        this.sk = sk;
        this.ret_coordtype = ret_coordtype;
        this.output = output;
    }

    // 获得查询的结果
    // 参数的顺序：address, city,  output,ret_coordtype
    async query(...options) {
        const queryObj = Object.assign({ ak: this.ak }, toObject(options, this));
        const queryUrl = buildQueryUrl('/geocoding/v3/', queryObj, this.sk);

        const response = await request.get(queryUrl);
        return JSON.parse(response.text);
    }
}

// 转换为对象
function toObject(options, { output, ret_coordtype }) {
    if (_.isEmpty(options)) return {};
    if (_.isObject(options[0])) return options[0];

    return {
        address: options[0],
        city: options[1] || '',
        output: options[2] || output,
        ret_coordtype: options[3] || ret_coordtype

    }
}

// 构建查询链接
function buildQueryUrl(apiUrl, queryObj, sk, sortParam = true) {
    let queryAry = _.map(queryObj, (val, key) => {
        return `${key}=${encodeURIComponent(val)}`;
    });

    if (sortParam) queryAry = _.sortBy(queryAry);

    const url = `${apiUrl}?${_.join(queryAry, '&')}`;
    const sn = md5(encodeURIComponent(url + sk));

    return `${BAIDU_MAP_API_HOST}${url}&sn=${sn}`;
}

module.exports = { BaiduMapGeocoding };