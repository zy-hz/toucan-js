// 
// 层连接池
//
const _ = require('lodash');
const { exURL } = require('../toucan-utility');

class LayerUrlTaskPool {

    constructor(url, layerIndex) {
        this.__urls__ = [];

        if (!_.isEmpty(url)) {
            this.push(url, layerIndex || 0);
        }
    }

    // 加入连接
    push(url, layerIndex) {
        // 检查url是否存在，如果存在，就放弃该url
        if (this.isExist(url)) return 0;

        this.__urls__.push({ url, layerIndex, isPop: false });
        return 1;
    }

    // 弹出连接链接
    pop(layerIndex = 0) {
        // 同层，没有弹出
        const obj = _.find(this.__urls__, { layerIndex, isPop: false });
        if (_.isNil(obj)) return ''

        // 设置弹出标记
        obj.isPop = true;
        return obj.url;
    }

    // 比较连接是否存在
    isExist(url) {
        return _.some(this.__urls__, (x) => {
            // http 和 https 认为是相同的
            return exURL.isSameUrl(url, x.url, { ignoreProtocol: true });
        })
    }

    // 剩余url任务的数量
    // 如果layerIndex == undefined，查询所有的层
    residualCount(layerIndex) {
        return _.sumBy(this.__urls__, (x) => {
            // 返回所有层，没有pop的数量
            if (_.isNil(layerIndex)) return x.isPop ? 0 : 1;

            // 返回指定层，没有pop的数量
            return !x.isPop && x.layerIndex === layerIndex ? 1 : 0;
        })
    }

    // 小于等于本层的所有数量
    sumLessThan(layerIndex) {
        return _.sumBy(this.__urls__, (x) => {
            // 返回指定层，没有pop的数量
            return x.layerIndex <= layerIndex ? 1 : 0;
        })
    }
}

module.exports = LayerUrlTaskPool;