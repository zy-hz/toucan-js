//
// 消息队列访问器工厂
//

const _ = require('lodash');

class ToucanMQVisitorFactory {

    // 创建消息队列
    create(mqType = 'base', option = {}) {
        const mqClassFile = `./_${_.lowerCase(mqType)}-mq-visitor.js`;
        const mqClassObj = require(mqClassFile);

        return new mqClassObj(option);
    }
}

module.exports = new ToucanMQVisitorFactory();
