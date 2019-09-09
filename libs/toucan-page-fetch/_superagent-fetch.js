const _ = require('lodash');
const request = require('superagent');
const encoding = require('encoding');
const charDecter = require('jschardet');
const util = require('./_common-utility');
const userAgents = require('./_user-agent');
const { onException } = require('./_fetch-exception');

class SuperAgentPageFetch {

    async do(url, option = {}) {

        const fetchType = 'request';

        try {
            // 用户的代理
            let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            // 根据选项构建url
            let visitUrl = util.buildUrl(url, option);
            // 使用二进制读取页面
            const response = await request
                .get(visitUrl)
                .responseType('binary')
                .set({ 'User-Agent': userAgent });

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
                fetchType,
                // 重试次数
                retryCount: 0,
                // 页面的原始字符集
                pageCharset: response.charset,
                // 状态码
                statusCode: response.statusCode
            };
        }
        catch (error) {
            return onException(error, fetchType);
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