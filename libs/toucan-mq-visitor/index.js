//
// 采集消息队列工厂
//

const _ = require('lodash');

// 创建消息队列
function createMQVisitor(mqType = 'toucan', option = {}) {

    // 没有指定消息队列类型，默认使用toucan类型
    if (typeof mqType != 'string' && _.isEmpty(option)) {
        option = Object.assign(option, mqType);
        mqType = 'toucan';
    }

    // 注意处理 sc-rabbit 这样的类型,中间有横杠
    const mqClassFile = `./_${_.kebabCase(_.lowerCase(mqType))}-mq-visitor.js`;
    const mqClassObj = require(mqClassFile);

    return new mqClassObj(option);
}

module.exports = createMQVisitor;