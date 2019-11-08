//
// 数据中心
//

const StationTable = require('./_table-station');

// 数据中心的类
class DbCenter {
    constructor(options){
        this.station = new StationTable(options)
    }

}

// 更加选项创建数据中心
function createDbCenter(options) {
    return new DbCenter(options)
}

module.exports = createDbCenter;