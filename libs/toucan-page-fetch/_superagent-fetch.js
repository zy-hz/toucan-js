const _ = require('lodash');
const request = require('superagent');
require('superagent-proxy')(request);
const encoding = require('encoding');
const charDecter = require('jschardet');
const util = require('./_common-utility');
const userAgents = require('./_user-agent');
const ToucanPageFetch = require('./_base-fetch');
const { onException } = require('./_fetch-exception');

class SuperAgentPageFetch extends ToucanPageFetch {

    constructor() {
        super();
        this.fetchType = 'request';
    }

    async do(url, options = {}) {

        try {
            // 用户的代理
            let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            // 根据选项构建url
            let visitUrl = util.buildUrl(url, options);
            // 获取任务的cookies
            const { requestCookie = '' } = options;
            // 使用二进制读取页面
            const response = await request
                .get(visitUrl)
                .responseType('binary')
                .set({ 'User-Agent': userAgent })
                .set({ 'Cookie': requestCookie });

            // 获取页面的字符集
            const pageCharset = getCharsetFromResponse(response);

            // 使用页面的指定编码转码为utf-8
            const pageContent = encoding.convert(response.body, 'utf-8', pageCharset, true).toString();

            return {
                // 抓取过程是否异常
                hasException: false,
                // 页面内容
                pageContent,
                // 抓手类型
                fetchType: this.fetchType,
                // 重试次数
                retryCount: 0,
                // 页面的原始字符集
                pageCharset,
                // 状态码
                statusCode: response.statusCode,
                // 响应的cookie
                responseCookie: response.header['set-cookie']
            };
        }
        catch (error) {
            return onException(error, this.fetchType);
        }
    }
}


function getCharsetFromResponse(response) {
    // 如果页面有了字符集就使用页面的字符集
    if (!_.isUndefined(response.charset)) return response.charset;

    const { encoding = 'utf-8' } = charDecter.detect(response.body);
    return encoding;
}

module.exports = SuperAgentPageFetch;