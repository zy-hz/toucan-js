/* eslint-disable no-undef */
const { ToucanLogger } = require('../../libs/toucan-work-unit');

describe('ToucanLogger 测试', () => {

    class TestLogger extends ToucanLogger {

    }

    it('', () => {
        const logger = new TestLogger();
        logger.log();
        logger.log('abc', 'ccc');
        logger.log({ obj1: 'abc' }, Date.now());

        logger.addDateInfo = '';
        logger.warn('abc', 'ccc');
    })

})