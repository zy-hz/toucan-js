// url 功能得扩展
const querystring = require('querystring');
const _ = require('lodash');
const { getObjectClassName } = require('./_class');

class exURL {

    // 比较两个url是否一致,默认是完全比较
    isSameUrl(a, b, { ignoreProtocol = false, ignorePath = false, ignoreSearch = false } = {}) {
        if (_.isEmpty(a) || _.isEmpty(b)) return false;

        a = this.fillProtocol(a);
        b = this.fillProtocol(b);

        const uA = new URL(a);
        const uB = new URL(b);

        if(!ignoreProtocol) {
            if(uA.protocol != uB.protocol) return false;
        }

        if(!ignorePath){
            if(uA.pathname != uB.pathname) return false;
        }

        if(!ignoreSearch){
            if(uA.search != uB.search) return false;
        }

        return uA.host === uB.host;
    }

    isSameHost(a, b) {
        if (_.isEmpty(a) || _.isEmpty(b)) return false;

        a = this.fillProtocol(a);
        b = this.fillProtocol(b);

        const uA = require('url').parse(a, true, true);
        const uB = require('url').parse(b, true, true);

        if (uA.host != uB.host) return false;
        return true;
    }

    // 是否为脚本
    isScript(a) {
        if (_.isEmpty(a)) return false;
        const uA = require('url').parse(a, true, true);
        if (_.isEmpty(uA.protocol)) return false;

        return uA.protocol.indexOf('script') >= 0;
    }

    // 为链接添加协议
    fillProtocol(url, p = 'http') {
        if (_.isEmpty(url)) return url;

        if (url.indexOf('//') < 0 && url.indexOf(':;') < 0) url = '//' + url;
        const uri = require('url').parse(url, true, true);
        uri.protocol = uri.protocol || p;

        url = uri.format();
        if (_.endsWith(url, '/')) url = url.substr(0, url.length - 1);
        return url.toLowerCase();
    }

    // 获得主机
    getHost(url) {
        url = this.fillProtocol(url);
        return require('url').parse(url, true, true).hostname;
    }

    // 获得查询对象
    getQuery(url) {
        const uri = require('url').parse(url);
        return querystring.parse(uri.query);
    }

    getQueryString(obj) {
        return querystring.stringify(obj, null, null, {
            // 忽略[]
            encodeURIComponent: (x) => {
                return /\[|\]/img.test(x) ? x : querystring.escape(x);
            }
        });
    }

    // 转换为标准URL对象，val 可以是string|obj|URL对象
    // http://nodejs.cn/api/url.html#url_url_format_url_options
    toUrlObject(val) {
        if (getObjectClassName(val) === 'URL') return val;

        if (_.isString(val)) {
            const uri = new URL(this.fillProtocol(val))
            uri.protocol = uri.protocol || 'http';
            return uri;
        }

        if (_.isObject(val)) {
            const uri = Object.assign(new URL('http://0.0.0.0'), val);
            return uri;
        }
    }
}

module.exports = { exURL: new exURL() };