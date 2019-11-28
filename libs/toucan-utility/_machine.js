//
// 机器的信息
//
const os = require('os');
const _ = require('lodash');

async function getMachineInfo() {
    const package = require('../../package.json');

    return {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        memory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        networkAddress: getNetworkAddress(),
        nodeVersion: process.version,
        libVersion: package.version,
    }
}

// 获得网络地址
function getNetworkAddress() {
    let result = [];
    const interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        const iface = interfaces[devName];
        _.forEach(iface, x => {
            if (x.address !== '127.0.0.1' && !x.internal) result.push(x);
        })
    }
    return result;
}

// 获得平台类型
// 可能的值有 'aix'、 'darwin'、 'freebsd'、 'linux'、 'openbsd'、 'sunos' 和 'win32'
// 如果 Node.js 在 Android 操作系统上构建，则也可能返回 'android' 值。
function getPlatformType() {
    return os.platform()
}

function isWindowPlatform() {
    return os.platform() === 'win32'
}

module.exports = { getMachineInfo, getNetworkAddress, getPlatformType, isWindowPlatform }