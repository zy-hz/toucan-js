// url 功能得扩展

const URL = require('url');
const _ = require('lodash');

class exURL {

    // 比较两个url是否一致
    isSameUrl(a, b) {
        if (_.isEmpty(a) || _.isEmpty(b)) return false;

        a = this.fillProtocol(a);
        b = this.fillProtocol(b);

        const uA = URL.parse(a);
        const uB = URL.parse(b);

        if (uA.host != uB.host) return false;
        if (uA.hostname != uB.hostname) return false;
        if (uA.path != uB.path) return false;

        return true;
    }

    isSameHost(a, b) {
        if (_.isEmpty(a) || _.isEmpty(b)) return false;

        a = this.fillProtocol(a);
        b = this.fillProtocol(b);

        const uA = URL.parse(a);
        const uB = URL.parse(b);

        if (uA.host != uB.host) return false;
        return true;
    }

    // 是否为脚本
    isScript(a) {
        if (_.isEmpty(a)) return false;
        const uA = URL.parse(a);
        if(_.isEmpty(uA.protocol)) return false;

        return uA.protocol.indexOf('script') >= 0;
    }

    // 为链接添加协议
    fillProtocol(url, p = 'http') {
        if (_.isEmpty(url)) return url;

        if (url.indexOf('//') < 0 && url.indexOf(':;') < 0) url = '//' + url;
        const uri = URL.parse(url, true, true);
        uri.protocol = uri.protocol || p;

        url = URL.format(uri);
        if (_.endsWith(url, '/')) url = url.substr(0, url.length - 1);
        return url.toLowerCase();
    }

    getHost(url){
        url = this.fillProtocol(url);
        return URL.parse(url, true, true).hostname;
    }
}

module.exports = { exURL: new exURL() };