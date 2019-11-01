//
// 采集任务读取器
//
const _ = require('lodash');
const { NullArgumentError } = require('../toucan-error');

class TaskVisitorFactory {

    create(options = {}) {

        const { dbType } = getCreateOptions(options);
        if (_.isEmpty(dbType)) throw new NullArgumentError('任务访问接口参数：dbType');

        // 注意处理 sc-rabbit 这样的类型,中间有横杠
        const mqClassFile = `./_${_.kebabCase(_.lowerCase(dbType || 'fake'))}-task-visitor.js`;
        const mqClassObj = require(mqClassFile);

        return new mqClassObj(options);
    }
}

// 获得创建的参数
function getCreateOptions(args){

    if(_.isObject(args)) return args;

    // 构建默认的文件对象
    return {
        dbType:'file',
        dbVisitor:args,
    }
}

module.exports = new TaskVisitorFactory();