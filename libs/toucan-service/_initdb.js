//
// 初始化服务相关的数据库
//
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { DbVisitor } = require('../toucan-utility');

// 获得脚本文件
function getSqlFiles(d) {
    // 检测目录是否存在
    if (!fs.existsSync(d)) return [];

    const files = _.filter(fs.readdirSync(d), p => path.extname(p) === '.sql');
    return _.map(files, x => path.join(d, x));
}

module.exports = async (d, options = {}, cb) => {

    const { dbConnection } = options;
    // 获得脚本文件
    const sqlFiles = getSqlFiles(d);

    // 创建数据库连接
    const dbv = new DbVisitor(dbConnection);
    try {
        for await (const p of sqlFiles) {
            // 运行回调
            if (!_.isNil(cb)) cb(`执行初始化脚本 -> ${path.basename(p)}`);
            // 执行每个数据连接
            await dbv.execSql(p);
        }
    }
    finally{
        await dbv.close();
    }
}