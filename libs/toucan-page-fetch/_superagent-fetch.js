const request = require('superagent');
const encoding = require('encoding');
const util = require('./_common-utility');

class SuperAgentPageFetch {

    async do(url, option = {}) {

        try {

            // 根据选项构建url
            let visitUrl = util.buildUrl(url, option);
            // 使用二进制读取页面
            const response = await request.get(visitUrl).responseType('binary');
            // 使用页面的指定编码转码为utf-8
            const pageContent = encoding.convert(response.body, 'utf-8', response.charset, true).toString();

            return {
                // 抓取过程是否异常
                hasException: false,
                // 页面内容
                pageContent,
                // 抓手类型
                fetchType: 'request',
                // 重试次数
                retryCount: 0,
                // 页面的原始字符集
                pageCharset: response.charset,
                // 状态码
                statusCode: response.statusCode
            };
        }
        catch (error) {
            const { code, errno, message, stack } = error
            return {
                // 抓取过程是否异常
                hasException: true,
                // 抓手类型
                fetchType: 'request',
                // 错误码
                code,
                // 错误码
                errno,
                // 错误信息
                message,
                // 调用堆栈
                stack
            }
        }
    }
}

module.exports = SuperAgentPageFetch;