//
// 采集消息队列工厂
//

const _ = require('lodash');

// 创建消息队列
function createMQVisitor(mqType = 'file', options = {}) {

    // 没有指定消息队列类型，默认使用toucan类型
    if (typeof mqType != 'string' && _.isEmpty(options)) {
        options = Object.assign(options, mqType);
        mqType = 'file';
    }

    // 注意处理 sc-rabbit 这样的类型,中间有横杠
    const mqVisitorClassFile = `./_${_.kebabCase(_.lowerCase(mqType))}-mq-visitor.js`;
    const mqVisitorClass = require(mqVisitorClassFile);

    return new mqVisitorClass(options);
}

module.exports = createMQVisitor;
