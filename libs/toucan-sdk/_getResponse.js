//
// 获取服务器的响应
//
const request = require('superagent');

module.exports = async (url, options = {}, method = 'get') => {

    const m = method.toLocaleLowerCase();
    let response;

    if (m === 'post') {
        response = await request.post(url).send(options);
    } else {
        response = await request.get(url).query(options);
    }

    return response.body;
}

