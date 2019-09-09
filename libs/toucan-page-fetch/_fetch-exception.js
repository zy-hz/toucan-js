// 当发生抓手异常
function onException(error, fetchType = '') {
    const { code, errno, message, stack } = error
    return {
        // 抓取过程是否异常
        hasException: true,
        // 抓手类型
        fetchType,
        // 错误码
        code,
        // 错误码
        errno,
        // 错误信息
        message,
        // 调用堆栈
        stack
    }
}

module.exports = {
    onException
}