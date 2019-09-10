const ToucanPageSipder = require('./_base-page-spider');

class ToucanHttpPageSpider extends ToucanPageSipder {

    constructor(option = {}) {
        // 继承基类的创建参数
        super(option);
        
        this.pageFetch = 'abc';
    }

    // 执行一个抓取任务
    async do(task) {
        console.log('i am demo woker.', task);
    }
}

module.exports = ToucanHttpPageSpider;