const fs = require('fs');
const knex = require('knex');
const _ = require('lodash');
const { verifySqlPermit } = require('./_sql-command');
const { getDateTimeString } = require('./_datetime')

class DbVisitor {
    constructor(options = {}) {
        const {
            client = 'mysql',
            host = '127.0.0.1',
            port = 3306,
            user = 'root',
            password = 'root',
            database = '',
            charset = 'utf8'
        } = options;

        // 构建数据库
        this.DB = knex({
            client,
            connection: {
                host, port, user, password, database, charset,
                multipleStatements: true
            }
        })

        // 数据库的连接
        this.connection = options;
    }

    // 关闭访问器
    async close() {
        if (_.isNil(this.DB)) return;

        await this.DB.destroy();
    }

    // 执行脚本
    // sql 可以是文件，也可以是支付串
    // 
    async execSql(sql, options = {}, ...args) {
        // 获得初始化脚本的权限
        const { initSqlPermit = {
            disableDrop: true,
            disableDelete: true,
            disableUpdate: true,
            disableTruncate: true,
        } } = options;

        // 如果是支付串，直接执行；如果是.sql 文件内容,则读取
        const content = fs.existsSync(sql) ? fs.readFileSync(sql, 'utf8') : sql;
        // 验证权限
        verifySqlPermit(content, initSqlPermit);
        return await this.DB.raw(content, args);
    }

    // 删除所有表
    async dropTables(...args) {
        args = _.flatten(args);
        if (_.isEmpty(args)) args.push('*');
        // 拼接表名匹配模式
        const pattern = _.map(args, x => { return `^${x}` }).join('|');

        let sql = `select table_name from information_schema.TABLES where table_schema ='${this.connection.database}' and TABLE_NAME REGEXP '${pattern}';`
        const result = await this.execSql(sql);
        sql = _.map(result[0], row => { return `drop table \`${row['TABLE_NAME']}\`;` }).join('\n');
        await this.execSql(sql, { initSqlPermit: { disableDrop: false } });
    }

    // 插入一个对象
    async insert(tbName, obj) {
        await this.DB(tbName).insert(obj);
    }
}

// 对象转为字段值
// string -> 'string'
// time -> '0000-00-00 00:00:00'
// number -> number
function convertObjectToFieldValue(val) {
    if (_.isString(val)) return `'${val}'`;
    if (_.isDate(val)) return `'${getDateTimeString(val)}'`;
    return val;
}

module.exports = { DbVisitor, convertObjectToFieldValue }