const request = require('superagent');
const encoding = require('encoding');
const URL = require('url');

async function getResponse(api, query = {}, port = 3000) {

    // 构建查询api地址
    const apiUrl = URL.resolve(`http://127.0.0.1:${port}`, api);

    // 获得服务器响应
    const response = await request.get(apiUrl).query(query).responseType('binary');

    // 使用页面的指定编码转码为utf-8
    const json = encoding.convert(response.body, 'utf-8').toString();

    // 转为对象
    const body = JSON.parse(json);
    return { body, statusCode: response.statusCode };
}

module.exports = { getResponse }