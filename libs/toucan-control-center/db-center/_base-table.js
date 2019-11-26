//
// table类的基类
//
const _ = require('lodash');
const { joinWhere } = require('./_base-where');
const { convertObjectToFieldValue } = require('../../toucan-utility');

module.exports = class {
    constructor(dbv, tbConst) {
        // 设置数据表的常量
        _.assign(this, tbConst);
        // 保存表常数
        this.tableConst = tbConst;
        this.dbv = dbv;
    }

    // 表访问对象
    // 如果不写，导致"Update called multiple times with objects"
    get tbVisitor() { return this.dbv(`${this.TABLENAME}`) }

    // 将对象影射为字段
    objMap2Field(obj) {
        return obj;
    }

    // 将对象影射为字段-标准字段
    objMap2Field_standard(obj) {
        const fields = {};

        _.forEach(this.tableConst, (val) => {
            if (obj[`${val}`]) fields[`${val}`] = obj[`${val}`];
        })

        return fields;
    }

    async insert(obj) {
        await this.tbVisitor.insert(this.objMap2Field(obj));
    }

    async insertBatch(rows) {
        var chunkSize = 50;
        await this.dbv.batchInsert(this.TABLENAME, rows, chunkSize);
    }

    async update(obj, ...where) {
        where = _.flatten(where);
        obj = this.objMap2Field(obj);

        const exec = joinWhere(this.tbVisitor, where).update(obj);
        await exec;
    }

    // replace into 是先删除再插入
    async replace(rows) {
        rows = _.castArray(rows);
        if (_.isEmpty(rows)) return;

        let keys;
        let vals = [];

        _.forEach(rows, x => {
            const vs = [];
            const ks = [];
            _.forEach(x, (val, key) => {
                vs.push(convertObjectToFieldValue(val));
                ks.push(key);
            })

            if (_.isEmpty(keys)) keys = ks.join(',');
            vals.push(`(${vs.join(',')})`);
        })

        const sqlCmd = `replace into ${this.TABLENAME} (${keys}) values ${_.join(vals, ',')}`;
        await this.dbv.raw(sqlCmd);
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

    async selectLimit(maxCount, ...where) {
        where = _.flatten(where);
        const exec = joinWhere(this.tbVisitor, where);
        exec._method = 'select';
        return await exec.limit(maxCount);
    }

    async selectOne(...where) {
        where = _.flatten(where);
        const result = await this.select(where);
        return _.isEmpty(result) ? undefined : result[0];
    }

    async destroy() {
        await this.dbv.destroy()
    }

    // 创建和自己相似的表
    async createLikeTable(tableName) {
        const sqlCommand = `create table if not exists \`${tableName}\` like \`${this.TABLENAME}\``;
        await this.dbv.raw(sqlCommand);
    }

}

