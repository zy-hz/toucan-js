//
// 机器的信息
//
const os = require('os');
const _ = require('lodash');

async function getMachineInfo() {

    return {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        memory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        networkAddress: getNetworkAddress()
    }
}

// 获得网络地址
function getNetworkAddress() {
    let result = [];
    const interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        const iface = interfaces[devName];
        _.forEach(iface, x => {
            if(x.address !== '127.0.0.1' && !x.internal) result.push(x);
        })
    }
    return result;
}

module.exports = { getMachineInfo, getNetworkAddress }