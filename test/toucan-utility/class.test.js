/* eslint-disable no-undef */
const expect = require('chai').expect;
const { isClass } = require('../../libs/toucan-utility/_class');

describe('[测试入口] - isClass', () => {

    it('obj 测试', () => {
        expect(isClass(undefined), 'undefined 不是类').to.be.false;
        expect(isClass(null), 'null 不是类').to.be.false;

        expect(isClass('abc'), 'abc 不是类').to.be.false;
        expect(isClass(new TestClass()), '对象不是类').to.be.false;
        expect(isClass(testFun), '函数不是类').to.be.false;

        expect(isClass(TestClass), 'TestClass 是类').to.be.true;
    });

    it('类名检查测试 ', () => {
        expect(isClass(TestClass, 'TestClass'), '类名是TestClass').to.be.true;
        expect(isClass(TestClass, 'BaseClass'), '基类是 BaseClass').to.be.true;
        expect(isClass(TestClass, 'RootClass'), '基类是 RootClass').to.be.true;


    });

});


class RootClass {

}

class BaseClass extends RootClass {

}

// 用于测试的类
class TestClass extends BaseClass {

    funA() {
        return 1;
    }
}


function testFun() {
    return 'abc';
}