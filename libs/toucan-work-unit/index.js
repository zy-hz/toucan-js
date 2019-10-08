// const ToucanWorkUnit = require('./_work-unit');
// const ToucanWorkUnitPool = require('./_work-unit-pool');
// const { ToucanLogger } = require('./_logger');

// module.exports = { ToucanWorkUnit, ToucanWorkUnitPool, ToucanLogger };

const { batchLoadModule } = require('../toucan-utility');

module.exports = batchLoadModule(__dirname);