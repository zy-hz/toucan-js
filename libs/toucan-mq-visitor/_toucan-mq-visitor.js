// 消息队列访问器的基类

class ToucanMQVisitor {

    constructor(option = {}) {
        // 设置对象
        this.option = Object.assign({}, option);
    }
}

module.exports = ToucanMQVisitor;