// 
// 任务接口-伪装（用于测试）
//
// 

class FakeTaskVisitor {

    constructor() {

    }

    // 同步读取任务
    async readTaskSync(options = {}) {

        return {
            taskType: 'GatherTask',
            taskBody: {
                targetUrl: 'www.sohu.com',
                depth: 0,
            }
        }
    }

}

module.exports = FakeTaskVisitor;