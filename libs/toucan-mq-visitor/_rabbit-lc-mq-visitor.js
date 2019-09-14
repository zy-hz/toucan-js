// 
// RabbitMQ Long Connection 版本接口
//
// 对象构造时创建connection
//
// 生产消息使用已创建的connection
// 消费消息使用已创建的connection
//

const BaseMQVisitor = require('./_base-mq-visitor');
const amqp = require('amqplib');

class LongConnRabbitMQVisitor extends BaseMQVisitor {

    constructor(option) {
        super(option);

        this.hosts = [];
        this.index = 0;
        this.length = this.hosts.length;
        this.open = amqp.connect(this.hosts[this.index]);
    }

    sendQueueMsg(queueName, msg, errCallBack) {
        let self = this;

        self.open
            .then(function (conn) {
                return conn.createChannel();
            })
            .then(function (channel) {
                return channel.assertQueue(queueName)
                    .then(function (ok) {
                        return channel.sendToQueue(queueName, new Buffer(msg), {
                            persistent: true
                        });
                    })
                    .then(function (data) {
                        if (data) {
                            errCallBack && errCallBack("success");
                            channel.close();
                        }
                    })
                    .catch(function () {
                        setTimeout(() => {
                            if (channel) {
                                channel.close();
                            }
                        }, 500)
                    });
            })
            .catch(function () {
                let num = self.index++;

                if (num <= self.length - 1) {
                    self.open = amqp.connect(self.hosts[num]);
                } else {
                    self.index == 0;
                }
            });
    }

    receiveQueueMsg(queueName, receiveCallBack, errCallBack) {
        let self = this;

        self.open
            .then(function (conn) {
                return conn.createChannel();
            })
            .then(function (channel) {
                return channel.assertQueue(queueName)
                    .then(function (ok) {
                        return channel.consume(queueName, function (msg) {
                            if (msg !== null) {
                                let data = msg.content.toString();
                                channel.ack(msg);
                                receiveCallBack && receiveCallBack(data);
                            }
                        })
                            .finally(function () {
                                setTimeout(() => {
                                    if (channel) {
                                        channel.close();
                                    }
                                }, 500)
                            });
                    })
            })
            .catch(function () {
                let num = self.index++;
                if (num <= self.length - 1) {
                    self.open = amqp.connect(self.hosts[num]);
                } else {
                    self.index = 0;
                    self.open = amqp.connect(self.hosts[0]);
                }
            });
    }


}

module.exports = LongConnRabbitMQVisitor;