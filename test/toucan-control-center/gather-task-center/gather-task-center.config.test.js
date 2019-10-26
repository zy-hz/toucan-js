/* eslint-disable no-undef */
const expect = require('chai').expect;
const lib = require('rewire')(`${process.cwd()}/libs/toucan-control-center/gather-task-center/_gather-task-center.config`);
const getConfig = lib.__get__('getConfig');
const path = require('path');

describe('[测试入口] - GatherTaskCenterConfig ', () => {
    const path1 = `${__dirname}/gather-task-center.config.1.json`;
    const path2 = `${__dirname}/gather-task-center.config.2.json`;
    const dbFileName = path.resolve(`${__dirname}`, 'gather-task-fake-data.txt').toLowerCase();

    it('getConfig fullName', () => {
        const cfg = getConfig(path1);
        expect(path.resolve(cfg.taskDbVisitor).toLowerCase()).to.be.eq(dbFileName);
    });

    it('taskDbVisitor short name', () => {
        const cfg = getConfig(path2);
        expect(path.resolve(cfg.taskDbVisitor).toLowerCase()).to.be.eq(dbFileName);
    });

})