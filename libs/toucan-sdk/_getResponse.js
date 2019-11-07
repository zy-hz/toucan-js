//
// 获取服务器的响应
//
const request = require('superagent');

module.exports = async (url, options = {}, method = 'get') => {

    const response = await request.get(url).query(options);
    return response.body;
}
