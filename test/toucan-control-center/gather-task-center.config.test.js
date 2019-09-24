/* eslint-disable no-undef */
const expect = require('chai').expect;
const lib = require('rewire')('../../libs/toucan-control-center/_gather-task-center.config');

const getConfig = lib.__get__('getConfig');

describe('GatherTaskCenterConfig 测试 temp',()=>{
    const path1 = 'd:/Works/大嘴鸟/toucan-js/test/toucan-control-center/gather-task-center.config.1.json';
    const path2 = 'd:/Works/大嘴鸟/toucan-js/test/toucan-control-center/gather-task-center.config.2.json';
    const dbFileName = 'd:/Works/大嘴鸟/toucan-js/test/toucan-control-center/gather-task-fake-data.txt';

    it('getConfig fullName',()=>{
        const cfg = getConfig(path1);
        expect(cfg.taskDbVisitor).to.be.eq(dbFileName);
    });

    it('taskDbVisitor short name temp',()=>{
        const cfg = getConfig(path2);
        expect(cfg.taskDbVisitor).to.be.eq(dbFileName);
    });

})