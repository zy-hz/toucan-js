//
// table类的基类
//
const _ = require('lodash');
const { joinWhere } = require('./_base-where');

module.exports = class {
    constructor(dbv, tbConst) {
        _.assign(this, tbConst);
        // 设置数据访问接口
        this.dbv = dbv(`${this.TABLENAME}`);
    }

    async insert(fields) {
        await this.dbv.insert(fields);
    }

    async update(fields, ...where) {

    }

    // 以下方法，不需要翻译器
    //

    // 按照条件删除
    async delete(...where) {
        const exec = joinWhere(this.dbv, where).del();
        await exec;
    }

    async select(...where) {
        const exec = joinWhere(this.dbv, where);
        exec._method = 'select';
        return await exec;
    }

}

