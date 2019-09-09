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

        // 运行体
        while (this.forceStop) {

            console.log('test one :', this.spiderName);
            await sleep(this.idleSleep);
            console.log('test two :', this.spiderName);
        }
    }

    // 停止蜘蛛的工作
    // delay: 延时停止
    async stop(delay = 1000) {
        await sleep(delay);
        // 设置停止标记
        this.forceStop = true;
    }
}

module.exports = ToucanPageSpider;