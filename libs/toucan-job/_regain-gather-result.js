//
// 回收采集结果的作业
//

const { TaskJob } = require('./_base-task-job');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

class RegainGatherResultJob extends TaskJob {
    constructor({
        // 任务消息队列
        taskMQ,
        // 结果队列
        resultQueue,
    }) {
        super();
        this.taskMQ = taskMQ;
        this.resultQueue = resultQueue;
    }

    // 执行作业（回收采集结果）
    async do() {

        for await (const q of this.resultQueue) {
            const jobCount = await this.do4Queue(q);
            this.log(`[RegainGatherResultJob] 处理${jobCount}个采集结果在队列->${q.queue}`);
        }
    }

    // 回收一个队列的采集结果
    async do4Queue(q) {
        const { queue, outDir } = q;
        const d = path.resolve(outDir);
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });

        let jobCount = 0;
        do {
            // 从消息队列订阅结果，这个阶段出现的异常，需要抛出
            // 测试的时候，可以将noAck设置为true
            const msg = await this.taskMQ.subscribeResult(queue, { consumeOptions: { noAck: false } });
            if (msg === false) break;

            // 保存结果到指定目录
            saveResult(msg, d);
            jobCount = jobCount + 1;

        } while (jobCount < 3) // 每次最多处理100个采集结果

        return jobCount;
    }

}

// 保存结果到指定目录
function saveResult(msg, outDir) {
    const fileName = buildTimeStampFileName(outDir);
    fs.writeFileSync(fileName, JSON.stringify(msg));

    return fileName
}

// 根据时间获得文件名
function buildTimeStampFileName(dirName) {
    let tick = _.now();
    let fileName = ''
    do {
        fileName = `${dirName}/${tick}.dat`;
        tick = tick + 1;
    } while (fs.existsSync(fileName));
    return fileName;
}

module.exports = { RegainGatherResultJob };