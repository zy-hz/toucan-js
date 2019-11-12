const _ = require('lodash');

// 拼接where
function joinWhere(dbv, ...where) {
    where = _.flatten(where);
    // 清空原有的状态
    dbv._statements = [];

    if (_.isEmpty(where)) return dbv;
    if (_.isObject(where[0])) return joinWhereAsObject(dbv, where);

    if (where.length > 1) return joinWhereAsString(dbv, where);
    return dbv.whereRaw(where[0]);
}

// where 是对象数组
function joinWhereAsObject(dbv, objs) {
    return dbv.where((builder) => {
        _.forEach(objs, (c, idx) => {
            if (idx == 0) {
                // 第一个条件使用where
                builder.where(c);
            } else {
                const { joinChar = 'and' } = c;
                if (joinChar.toLowerCase() == 'and') {
                    builder.andWhere(c);
                } else {
                    builder.orWhere(c);
                }
            }
        })
    })
}

// where 是字符串数组
function joinWhereAsString(dbv, pms) {
    return dbv.where(`${pms[0]}`, pms[1]);
}

module.exports = { joinWhere }