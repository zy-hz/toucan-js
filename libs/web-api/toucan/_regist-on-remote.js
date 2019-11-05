//
// 在远程服务器上注册站点
//

// 在指定的服务器上注册自己
// 返回服务器的信息

async function registOnRemote(url) {

    return {
        serverInfo: {
            host: 'http://127.0.0.1:57701'
        }

    }
}

module.exports = { tcRegistOnRemote: registOnRemote }