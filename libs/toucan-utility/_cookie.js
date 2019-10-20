const _ = require('lodash');

class exCookie {

    constructor(cookie) {
        this.__cookie__ = this.parse(cookie);
    }

    // 转成字符串
    toString(order = '') {
        let ary = _.isEmpty(order) ? this.__cookie__ : _.sortBy(this.__cookie__);
        ary = _.map(ary, (val, key) => { return `${key}=${val}` });

        return _.join(ary, '; ');
    }

    // 设置参数
    // arg 可以是数组，也可以是支付串
    setCookie(arg) {
        const ary = _.castArray(arg);
        this.__cookie__ = Object.assign(this.__cookie__, this.parse(ary));
    }

    parse(arg) {

        const ary = _.isArray(arg) ? arg : _.split(arg, ';');
        const obj = {};
        _.forEach(ary, (x) => {
            const attr = this.getAttrObj(x);
            if (!_.isNil(attr)) Object.assign(obj, attr);
        })

        return obj;
    }

    // 获得一个属性对象
    getAttrObj(x) {
        if (_.isEmpty(x)) return undefined;
        x = x.trim();
        if (_.isEmpty(x)) return undefined;

        const obj = {}
        const pms = _.split(x, '=');
        const val = pms.length === 1 ? '' : pms[1].trim();

        obj[`${pms[0].trim()}`] = val;
        return obj;
    }
}

module.exports = { exCookie };