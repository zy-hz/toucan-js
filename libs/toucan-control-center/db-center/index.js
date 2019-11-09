//
// 数据中心
//

const StationTable = require('./_table-station');
const stationTableConst = require('./_table-station-const');

// 数据中心的类
class DbCenter {

    constructor(options) {

        const knex = require('knex')({
            client: options.client || 'mysql',
            connection: options
        });
        
        this.station = new StationTable(knex)
        this.station.const = stationTableConst;
    }

}

// 更加选项创建数据中心
function createDbCenter(options) {
    return new DbCenter(options)
}

module.exports = createDbCenter;