// 
// 任务接口-伪装（用于测试）
//
// 
const _ = require('lodash');

class FakeTaskVisitor {

    constructor() {

    }

    // 同步读取任务
    async readTaskSync({ maxCount = 1 } = {}) {

        return _.slice(fakeTaskGroup, 0, maxCount);
    }

}

const fakeTaskGroup = [
    {
        taskType: 'GatherTask',
        taskBody: {
            targetUrl: 'www.sohu.com',
            spiderType:'http',
            depth: 0,
        }
    }
    , {
        taskType: 'GatherTask',
        taskBody: {
            targetUrl: 'www.baidu.com',
            spiderType:'browser',
            depth: 0,
        }
    },
    {
        taskType: 'GatherTask',
        taskBody: {
            targetUrl: 'www.sina.com',
            depth: 0,
        }
    },
    {
        taskType: 'GatherTask',
        taskBody: {
            targetUrl: 'www.zol.com.cn',
            depth: 0,
        }
    }

]

module.exports = FakeTaskVisitor;