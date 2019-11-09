//
// table类的基类
//
const _ = require('lodash');
const { joinWhere } = require('./_base-where');

module.exports = class {
    constructor(dbv, tbConst) {
        // 设置数据表的常量
        _.assign(this, tbConst);
        // 设置数据访问接口
        this.tbVisitor = dbv(`${this.TABLENAME}`);
        // 保存表常数
        this.tableConst = tbConst;
        this.dbv = dbv;
    }

    // 将对象影射为字段
    objMap2Field(obj) {
        return obj;
    }

    async insert(obj) {
        await this.tbVisitor.insert(this.objMap2Field(obj));
    }

    async update(obj, ...where) {
        where = _.flatten(where);
        obj = this.objMap2Field(obj);

        const exec = joinWhere(this.tbVisitor, where).update(obj);
        await exec;
    }

    // 以下方法，不需要翻译器
    //

    // 按照条件删除
    async delete(...where) {
        where = _.flatten(where);
        const exec = joinWhere(this.tbVisitor, where).del();
        await exec;
    }

    async select(...where) {
        where = _.flatten(where);
        const exec = joinWhere(this.tbVisitor, where);
        exec._method = 'select';
        return await exec;
    }

    async selectOne(...where) {
        where = _.flatten(where);
        const result = await this.select(where);
        return _.isEmpty(result) ? undefined : result[0];
    }

    async destroy() {
        await this.dbv.destroy()
    }
}

