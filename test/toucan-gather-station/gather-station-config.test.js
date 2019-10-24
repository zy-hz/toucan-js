/* eslint-disable no-undef */
const lib = require("rewire")('../../libs/toucan-gather-station/_gather-station-config');
const getConfig = require('../../libs/toucan-gather-station/_gather-station-config');
const readConfigFromFile = lib.__get__('readConfigFromFile');

const expect = require('chai').expect;

describe('[测试入口] - gather station config 测试', () => {

    describe('getConfig', () => {

        it('没有指定文件名', () => {
            const cfg = getConfig();
            expect(cfg.gatherSkill.maxGatherCellCount).to.be.eq(9);

            cfg.gatherSkill.maxGatherCellCount = 10;

            // 测试默认对象不能被改变
            const cfg2 = getConfig();
            expect(cfg2.gatherSkill.maxGatherCellCount).to.be.eq(9);
        });

    })

    describe('readConfigFromFile', () => {
        const cfgFileName = __dirname + '/sample/gsconfig.json'

        it('从指定文件读取', () => {
            const cfg = readConfigFromFile(cfgFileName);
            expect(cfg.gatherSkill.maxGatherCellCount).to.be.eq(2);
        })
    })
})