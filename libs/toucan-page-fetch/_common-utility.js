// 通用工具
const _ = require('lodash');
const urlBuilder = require('build-url');

class CommonUtility {
    // 根据选项构建url
    buildUrl(url, { params = '', requestType = 'get' } = {}) {
        // post 的请求类型不用构建url
        if (requestType === 'post') return url;

        // 没有需要构建的参数，返回url
        if (_.isEmpty(params)) return url;

        return urlBuilder(url, {
            path: encodeURI(params)
        });
    }
}

module.exports = new CommonUtility();