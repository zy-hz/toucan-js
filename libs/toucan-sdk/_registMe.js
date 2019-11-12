//
// 在远程服务器上注册自己
//
const { exURL, getMachineInfo } = require('../toucan-utility');
const getResponse = require('./_getResponse');
const _ = require('lodash');

// serverUrl 是 URL 字符串或URL 对象
module.exports = async (serverUrl, options = {}) => {
    // 标准url对象
    const url = exURL.toUrlObject(serverUrl);

    // 设置注册的方法
    if (_.isEmpty(url.pathname) || url.pathname === '/') url.pathname = '/regist-station';

    // 获得本机的信息
    const meInfo = {
        machineInfo: await getMachineInfo()
    }
    
    // 从服务器获得响应
    return await getResponse(url, Object.assign(options, meInfo),'POST');
}

