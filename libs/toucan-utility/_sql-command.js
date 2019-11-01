// 验证sql是否符合权限的要求，如果不符合，抛出异常
//
function verifySqlPermit(sql,
    {
        disableDrop = false,
        disableDelete = false,
        disableUpdate = false,
        disableTruncate = false,
    } = {}
) {
    if (disableDrop) forbidSqlCommand(sql, 'drop');
    if (disableDelete) forbidSqlCommand(sql, 'delete');
    if (disableUpdate) forbidSqlCommand(sql, 'update');
    if (disableTruncate) forbidSqlCommand(sql, 'truncate');
}

// 验证sql命令
function forbidSqlCommand(sql, cmd) {
    const regex = new RegExp(`(^| +)${cmd}($| +)`,'im');
    if (regex.test(sql)) {
        const err = new Error(`${cmd}命令被禁止执行`);
        err.source = sql;
        throw err;
    }
}

module.exports = { verifySqlPermit };