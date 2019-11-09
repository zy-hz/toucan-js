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
        this.dbv = dbv(`${this.TABLENAME}`);
        // 保存表常数
        this.tableConst = tbConst;
    }

    // 将对象影射为字段
    objMap2Field(obj) {
        return obj;
    }

    async insert(obj) {
        await this.dbv.insert(this.objMap2Field(obj));
    }

    async update(obj, ...where) {
        const exec = joinWhere(this.dbv, where).update(this.objMap2Field(obj));
        await exec;
    }

    // 以下方法，不需要翻译器
    //

    // 按照条件删除
    async delete(...where) {
        const exec = joinWhere(this.dbv, where).del();
        await exec;
    }

    async select(...where) {
        where = _.flatten(where);
        const exec = joinWhere(this.dbv, where);
        exec._method = 'select';
        return await exec;
    }

    async selectOne(...where) {
        where = _.flatten(where);
        const result = await this.select(where);
        return _.isEmpty(result) ? undefined : result[0];
    }

}

