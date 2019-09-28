const _ = require('lodash');
const fs = require('fs');

class TaskVisitorFactory {

    create(options = {}) {

        const visitoryType = getVisitorType(options);

        // 注意处理 sc-rabbit 这样的类型,中间有横杠
        const mqClassFile = `./_${_.kebabCase(_.lowerCase(visitoryType || 'fake'))}-task-visitor.js`;
        const mqClassObj = require(mqClassFile);

        return new mqClassObj(options);
    }

}

// 从参数种获得类型
function getVisitorType(args) {
    if(_.isNil(args)) return '';
    if(_.isEmpty(args)) return '';

    if(_.isString(args)) return parseVisitorType(args);
    return args.visitoryType;
}

// 从文本获得访问接口的类型
function parseVisitorType(s){
    if (fs.existsSync(s)) return 'file';

    return 'unknown';
}

module.exports = new TaskVisitorFactory();