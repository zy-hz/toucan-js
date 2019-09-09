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
class ToucanPageSpider {

    // 构造页面蜘蛛
    constructor({
        onGetTask,
        // 蜘蛛的名称
        spiderName,
        // 空闲的时候，暂停的时间
        idleSleep = 1000,
    } = {}) {

        // 获得任务
        this.onGetTask = onGetTask;

        this.spiderName = spiderName;
        this.idleSleep = idleSleep;
    }

    // 蜘蛛开始运行
    async run() {
        let cnt = 0;
        while (cnt < 10) {
            console.log('test one :', this.spiderName);
            await sleep(this.idleSleep);
            console.log('test two :', this.spiderName, cnt);

            cnt = cnt + 1;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = ToucanPageSpider;