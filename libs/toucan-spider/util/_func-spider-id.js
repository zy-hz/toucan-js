const _ = require('lodash');
const url = require('url');
const fs = require('fs');

// 根据类型获得蜘蛛编号
function getSpiderIdBySpiderType(spiderType) {
    if (_.isEmpty(spiderType)) return '';

    return 'toucan.cm.' + _.lowerCase(spiderType);
}

// 根据目标名称蜘蛛编号
function getSpiderIdByTargetName(targetName) {
    if (_.isEmpty(targetName)) return '';

    return 'toucan.sp.' + _.lowerCase(targetName).replace(/ /img,'.');
}

// 根据目标连接蜘蛛编号
function getSpiderIdByTargetUrl(targetUrl) {
    if (_.isEmpty(targetUrl)) return '';

    targetUrl = targetUrl.toLowerCase();
    if (!_.startsWith(targetUrl, 'https://') && !_.startsWith(targetUrl, 'http://')) targetUrl = 'http://' + targetUrl;

    const myUrl = url.parse(targetUrl);
    const hostName = myUrl.hostname.split('.').reverse().join('.')

    // 发现所有的特殊蜘蛛
    let spNames = findAllSpiderNames();

    // 按照名称长度，从长到短排序
    spNames = spNames.sort((a, b) => {
        return a.length < b.length;
    })

    const spiderId = _.find(spNames, (x) => { return _.startsWith(hostName, x) })
    if(_.isEmpty(spiderId)) return '';

    return 'toucan.sp.' + spiderId;
}

// 发现所有的蜘蛛名称
function findAllSpiderNames() {

    let spiders = [];
    _.forEach(fs.readdirSync(__dirname + '/../toucan.sp/'), (x) => {

        const match = x.match(/_(.*?).js/im);
        if (!_.isNil(match)) {
            spiders.push(match[1].replace(/-/img, '.'));
        }
    });

    return spiders;
}

module.exports = { getSpiderIdBySpiderType, getSpiderIdByTargetName, getSpiderIdByTargetUrl };