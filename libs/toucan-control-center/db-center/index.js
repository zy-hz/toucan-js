//
// 数据中心
//

const dbConst = require('./const');
const StationTable = require('./_table-station');

// 数据中心的类
class DbCenter {

    constructor(options) {

        const knex = require('knex')({
            client: options.client || 'mysql',
            connection: options
        });

        this.station = new StationTable(knex, dbConst.station);
    }

    async destroy() {
        await this.station.destroy();
    }

}

// 更加选项创建数据中心
function createDbCenter(options) {
    return new DbCenter(options)
}

module.exports = createDbCenter;