// 批量获取经纬度

const { BaiduMapGeocoding } = require('../../../libs/web-api');
const fs = require('fs');
const _ = require('lodash');

const srcFile = `${process.cwd()}/.sample/elm/小区.txt`;
const api = new BaiduMapGeocoding(getAppKey());

const task = readTaskFromFile(srcFile);

run(task);

async function run(task) {
    for await (const t of task) {
        const ok = await api.query(t, '杭州');
        const { status = -1, result = {} } = ok;

        const output = buildOutputAsLine(t, status, result.location);
        console.log(output);
        fs.appendFileSync(srcFile + '.result', output + '\r\n');
    }
}

function readTaskFromFile(file) {
    return _.split(fs.readFileSync(file, 'utf-8'), '\r\n');
}

// 访问百度接口需要使用ak,sk（百度提供）
function getAppKey() {
    const fileName = `${process.cwd()}/.sample/baidu/appkey.json`;
    return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
}

function buildOutputAsLine(address, status, { lat = '', lng = '' } = {}) {
    return `${address}\t${status}\t${lat}\t${lng}`;
}
