// 站点url记录器
const _ = require('lodash');
class SiteUrlCount {
    constructor({ innerUrl = 0, outerUrl = 0, scriptUrl = 0 } = {}) {
        this.innerUrl = innerUrl;
        this.outerUrl = outerUrl;
        this.scriptUrl = scriptUrl;
    }

    add({ innerUrl = 0, outerUrl = 0, scriptUrl = 0 } = {}) {
        const obj = _.cloneDeep(this);
        obj.innerUrl = this.innerUrl + innerUrl;
        obj.outerUrl = this.outerUrl + outerUrl;
        obj.scriptUrl = this.scriptUrl + scriptUrl;
        return obj;
    }
}

function createNew(val = {}) {
    return new SiteUrlCount(val);
}

module.exports = { SiteUrlCount: createNew };