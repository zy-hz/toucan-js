// 提取器的基类
const { exHTML } = require('../../toucan-utility');
const _ = require('lodash');

class BaseSubTaskExtractor {
    constructor(options = {}) {
        this.options = options;
    }

    extract(task, page) {
        const { targetUrl, targetLayerIndex = 0 } = task || {};
        const { pageContent } = page || {};
        const { limitSubTask = 0 } = this.options;

        if (_.isEmpty(targetUrl) || _.isEmpty(pageContent)) return [];
        // 获得内部的连接
        const innerLinks = exHTML.extractHyperlink(pageContent, { baseUrl: targetUrl });
        const result = _.map(innerLinks, x => {
            return {
                targetUrl: x.aHref,
                targetHrefText: x.aText,
                targetLayerIndex: targetLayerIndex + 1
            }
        })

        return limitSubTask === 0 ? result : _.slice(result, 0, limitSubTask);
    }
}

module.exports = BaseSubTaskExtractor