/* eslint-disable no-undef */
const expect = require('chai').expect;
const _ = require('lodash');

describe('NullArgumentError 测试', () => {

    it('', () => {
        const { NullArgumentError } = require('../../libs/toucan-error');
        expect(_.isNil(NullArgumentError),'NullArgumentError 类已经构建').to.be.false;

        const error = new NullArgumentError('abc');
        expect(error.argName,'参数名').to.be.eq('abc');
        expect(error.message,'error message').to.be.eq('abc 不能为空');

        expect(_.isEmpty(error.stack),'stack 不能为空').to.be.false;

    });

});