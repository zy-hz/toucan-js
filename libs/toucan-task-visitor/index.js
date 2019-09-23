const _ = require('lodash');

class TaskVisitorFactory {

    create(options = {}) {

        const { visitoryType } = options;

        // 注意处理 sc-rabbit 这样的类型,中间有横杠
        const mqClassFile = `./_${_.kebabCase(_.lowerCase(visitoryType || 'fake'))}-task-visitor.js`;
        const mqClassObj = require(mqClassFile);

        return new mqClassObj(options);
    }
}

module.exports = new TaskVisitorFactory();