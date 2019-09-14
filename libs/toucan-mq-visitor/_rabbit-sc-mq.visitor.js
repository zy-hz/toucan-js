// 
// RabbitMQ Short Connection 版本接口
//
// 生产消息前创建connection ,生成消息后connection关闭
// 消费消息前创建connection，消费消息后connection关闭
//

const BaseMQVisitor = require('./_base-mq-visitor');
const amqp = require('amqplib');

class ShortConnRabbitMQVisitor extends BaseMQVisitor{

}

module.exports = ShortConnRabbitMQVisitor;