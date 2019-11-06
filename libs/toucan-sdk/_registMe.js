//
// 在远程服务器上注册自己
//
const { exURL } = require('../toucan-utility');
const getResponse = require('./_getResponse');

// serverUrl 是 URL 字符串或URL 对象
module.exports = async (serverUrl, options = {}) => {
    // 标准url对象
    const url = exURL.toUrlObject(serverUrl);

    // 从服务器获得响应
    return await getResponse(url, options);
}

