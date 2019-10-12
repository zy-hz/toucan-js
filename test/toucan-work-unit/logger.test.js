/* eslint-disable no-undef */
const { ToucanLogger } = require('../../libs/toucan-work-unit');

describe('ToucanLogger 测试 ', () => {

    class TestLogger extends ToucanLogger {

    }

    it('', () => {
        const logger = new TestLogger();
        logger.split();
        logger.split('*', '我是测试我是测试');
        logger.split('*', 'I am test');
        logger.log('abc', 'ccc');
        logger.log({ obj1: 'abc' }, Date.now());

        logger.addDateInfo = '';
        logger.warn('abc', 'ccc');
    })

    it('object ', () => {
        const logger = new TestLogger();
        logger.log({ obj1: 'abc' }, Date.now());
    });

    it('error ', () => {
        const logger = new TestLogger();
        logger.error('this.is test', new Error('错误测试'));
    })
})