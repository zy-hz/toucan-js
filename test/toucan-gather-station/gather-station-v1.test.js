/* eslint-disable no-undef */
const ToucanGatherStation = require('../../libs/toucan-gather-station');
const expect = require('chai').expect;
const _ = require('lodash');

const lib = require("rewire")('../../libs/toucan-gather-station/_gather-statioin-v1');
const buildGatherCellPool = lib.__get__('buildGatherCellPool');
const buildGatherCells = lib.__get__('buildGatherCells');

const { sleep } = require('../../libs/toucan-utility');

const fs = require('fs');

describe('GatherStationV1 综合测试 ', () => {

    describe('GatherStationV1 测试 ', () => {
        const cfgFileName = `${__dirname}/sample/gsconfig.json`;

        it('读取配置文件', () => {
            const gs = new ToucanGatherStation(cfgFileName);
            expect(_.isNil(gs)).to.be.false;

            runExpect4GatherSkill(gs.stationConfig.gatherSkill);
            runExpect4MessageQueue(gs.stationConfig.messageQueue);
        });

        it('读取demo的配置',async ()=>{
            const gs = new ToucanGatherStation(`${process.cwd()}/demo/gather-station/gsconfig.json`);
            gs.stationConfig.autoStart = false;
            await gs.init();

            expect(gs.gatherCellPool.length).to.be.eq(gs.stationConfig.gatherSkill.maxGatherCellCount);
        })

        it('初始化-不启动 ', async () => {
            const gs = new ToucanGatherStation(cfgFileName);
            gs.stationConfig.autoStart = false;
            await gs.init();

            expect(gs.workInfo.unitStatus.isIdle).to.be.true;
            expect(gs.unitInfo.unitAddress).is.not.empty;
        });

        it('初始化-启动', async () => {
            const gs = new ToucanGatherStation(cfgFileName);
            await gs.init();

            expect(gs.workInfo.unitStatus.isActived, '状态应为启动').to.be.true;
            expect(gs.unitInfo.unitName, '期望是机器名称').to.be.eq('DESKTOP-19SS3KS');
            expect(gs.unitInfo.unitAddress).is.not.empty;

            await gs.stop();
        });
    });

    describe('GatherStationV1 内部方法测试 ', () => {

        it('buildGatherCellPool 参数异常', () => {
            try {
                buildGatherCellPool();
            }
            catch (e) {
                expect(e.argName).to.be.eq('maxGatherCellCount');
            }

            try {
                buildGatherCellPool({ maxGatherCellCount: 5 });
            }
            catch (e) {
                expect(e.argName).to.be.eq('gatherCells');
            }
        });

        it('buildGatherCells 1模板2实例测试', () => {
            const skill = {
                skillName: 'http采集',
                skillKeys: ['cm.http', 'cm.browser'],
                skillCapability: 2,
            }
            const gcs = buildGatherCells(skill, 9, { unitId: 'test', unitAddress: 'my.add.111' });
            expect(gcs).to.have.lengthOf(2);
            expect(gcs[1].mqVisitor).is.not.null;
            expect(gcs[1].unitInfo.unitName).to.be.eq(skill.skillName);
            expect(gcs[1].unitInfo.unitId).to.be.eq('test-10');
            expect(gcs[1].unitInfo.unitNo).to.be.eq('02');
            expect(gcs[1].unitInfo.unitAddress).to.be.eq('my.add.111');

        });

        it('buildGatherCellPool 结果测试 ', () => {
            const skills = {
                maxGatherCellCount: 5,
                gatherCells: [{
                    skillName: 'http采集',
                    skillKeys: ['cm.http'],
                    skillCapability: 2,
                },
                {
                    skillName: 'browsers采集',
                    skillKeys: ['cm.browser'],
                    skillCapability: -1,
                }]
            }

            const gcPool = buildGatherCellPool(skills);
            expect(gcPool, '队列长度异常').to.have.lengthOf(skills.maxGatherCellCount);

            const gc1 = gcPool.findIndex(0);
            const gc5 = gcPool.findIndex(4);

            expect(gc1.unitInfo.unitName).to.be.eq('http采集');
            expect(gc5.unitInfo.unitName).to.be.eq('browsers采集');
            expect(gc1.gatherMQ).to.not.eq(gc5.gatherMQ);

        });
    });

    describe('GatherStationV1 file模式测试', () => {
        const skillKeys = ['cm.http', 'cm.browser'];
        const q1 = `${process.cwd()}/cache/filemq/toucan.${skillKeys[0]}`;
        const q2 = `${process.cwd()}/cache/filemq/toucan.${skillKeys[1]}`;

        before(() => {
            if (fs.existsSync(q1)) fs.unlinkSync(q1);
            if (fs.existsSync(q2)) fs.unlinkSync(q2);
        })

        it('', async () => {
            const gs = new ToucanGatherStation({
                autoStart: true,
                gatherSkill: {
                    // 本采集站拥有的采集单元的数量
                    maxGatherCellCount: 9,
                    // 采集单元的集合
                    gatherCells: [
                        {
                            skillName: 'fileMQ测试',
                            skillDescription: '支持http协议和模拟浏览器采集任务',
                            skillKeys,
                            skillCapability: 1,
                        }
                    ],
                },
                messageQueue: { mqType: 'file' }
            });
            await gs.init();

            expect(gs.workInfo.unitStatus.isActived, '状态应为启动').to.be.true;
            expect(gs.unitInfo.unitName, '期望是机器名称').to.be.eq('DESKTOP-19SS3KS');
            expect(gs.unitInfo.unitAddress).is.not.empty;

            await sleep(1000);
            // 当没有设置任务的时候，不应该有这样的期待
            //expect(fs.existsSync(q1)).is.true;
            //expect(fs.existsSync(q2)).is.true;

            await gs.stop();
        })
    })

    function runExpect4GatherSkill(gatherSkill) {

        expect(gatherSkill.maxGatherCellCount, 'maxGatherCellCount 需要大于0').to.be.greaterThan(0);

        runExpect4GatherCells(gatherSkill.gatherCells);
    }

    function runExpect4GatherCells(gatherCells) {
        expect(Array.isArray(gatherCells), '采集单元是个数组').to.be.true;
        expect(gatherCells, '采集单元不能是空数组').is.not.empty;

        _.forEach(gatherCells, runExpect4SkillCell)
    }
    // 技能单元测试
    function runExpect4SkillCell(skillCell) {
        expect(skillCell.skillName, '能力名称不能空').is.not.empty;
        expect(_.isArray(skillCell.skillKeys), '能力关键词是个数组').to.be.true;
        expect(skillCell.skillKeys, '能力关键词不能为空').is.not.empty;
    }
    // 消息队列单元测试
    function runExpect4MessageQueue(messageQueue) {
        expect(messageQueue.mqType).to.be.eq('rabbit');
    }
})

