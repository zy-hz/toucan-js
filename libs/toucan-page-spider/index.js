// 页面蜘蛛
//
// 功能描述：
// 从来源读取需要抓取的网页地址（抓取任务）
// 抓取网页内容
// 按照设置解析网页中的链接，并且存入指定位置
// 按照设置将页面内容存入指定位置
// 按照设置自动获取下一个抓取任务
// 触发抓取任务完成，抓取任务异常事件
//
//

const _ = require('lodash');
const { sleep } = require('../toucan-utility');

class ToucanPageSpider {

    // 构造页面蜘蛛
    constructor({
        // 触发获取任务的回掉
        onGetTask,
        // 蜘蛛的名称         
        spiderName,
        // 空闲的时候，暂停的时间
        idleSleep,
    } = {}) {

        //
        // 设置属性的默认值
        //
        this.spiderName = spiderName || 'unknown';
        this.idleSleep = idleSleep || 1000;
    }

    // 蜘蛛开始运行
    async start() {
        // 强制停止标记
        this.forceStop = false;

        try {
            // 设置正在运行的标记
            this.isRunning = true;
            // 运行体
            while (!this.forceStop) {

                await sleep(this.idleSleep);
            }
        }
        finally {
            this.isRunning = false
        }

    }

    // 停止蜘蛛的工作
    async stop({
        // 延时停止的毫秒
        delay = 10,
        // 等待蜘蛛停止成功。0 表示不等待, -1 表示一直等待，其他整数表示等待的毫秒
        expectWaitMillionSecond = -1
    } = {}) {
        await sleep(delay);
        // 设置停止标记
        this.forceStop = true;

        // 如果 -1 表示一直等待，设置为一天
        expectWaitMillionSecond = expectWaitMillionSecond === -1 ? 1000 * 60 * 60 * 24 : expectWaitMillionSecond;
        // 等待的毫秒
        let waitMillionSecond = 0
        while (this.isRunning && waitMillionSecond < expectWaitMillionSecond) {

            await sleep(100);
            waitMillionSecond = waitMillionSecond + 100;
        }
    }

    // 执行一个抓取任务
    async do(){

    }
}

module.exports = ToucanPageSpider;