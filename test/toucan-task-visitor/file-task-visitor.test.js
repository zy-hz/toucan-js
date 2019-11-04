/* eslint-disable no-undef */
const expect = require('chai').expect;
const tvFactory = require('../../libs/toucan-task-visitor');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { sleep } = require('../../libs/toucan-utility');
const lib = require('rewire')('../../libs/toucan-task-visitor/_file-task-visitor.js');
const applyFormat = lib.__get__('applyFormat');
const readTaskLines = lib.__get__('readTaskLines');
const getTaskCacheFileName = lib.__get__('getTaskCacheFileName');

describe('[测试入口] - FileTaskVisitor', () => {
    const fileName = __dirname + '/./file-task-visitor.data.txt';

    it('create', () => {
        const tv = tvFactory.create(fileName);
        expect(tv.__taskPool).have.lengthOf(5);
    });

    describe('readTaskSync', () => {
        const tv = tvFactory.create(fileName);

        it('第1次read', async () => {
            const task = await tv.readTaskSync();
            expect(task[0].taskBody.targetUrl).to.be.eq('mednova.com.cn');
            expect(task[0].taskBody.nextPublishTime).to.be.greaterThan(_.now() + 1000);
        });

        it('第2次read', async () => {
            const task = await tv.readTaskSync();
            expect(task[0].taskBody.targetUrl).to.be.eq('aek56.com');
        });

        it('读取剩下3个', async () => {
            const task = await tv.readTaskSync({ maxCount: 10 });
            expect(task).have.lengthOf(3);
        });

        it('[long]间隔再次读取 等待6000ms', async () => {
            let task = await tv.readTaskSync();
            expect(task).have.lengthOf(0);

            await sleep(6000);
            task = await tv.readTaskSync();
            expect(task[0].taskBody.targetUrl).to.be.eq('mednova.com.cn');
        });

    })

    describe('urlFormat 测试', () => {
        it(' applyFormat 测试',()=>{
            const result = applyFormat('abc','http://${0}');
            expect(result).to.be.eq('http://abc');
        })

        it('read with format 测试', async () => {
            const tv = tvFactory.create({ dbType: 'file', dbVisitor: fileName, urlFormat: 'http://${0}' });
            const task = await tv.readTaskSync();
            expect(task[0].taskBody.targetUrl).to.be.eq('http://mednova.com.cn');
        })

    })

    describe('temp cache 测试',()=>{
        const cacheFileName = getTaskCacheFileName(fileName);

        before('创建测试缓存',()=>{
            if(fs.existsSync(cacheFileName)) fs.unlinkSync(cacheFileName);
            fs.appendFileSync(cacheFileName,'mednova.com.cn  http    -1' + '\r\n');
        })

        it('readTaskLines',()=>{
            const line1 = readTaskLines(fileName,false);
            expect(line1).have.lengthOf(5);
            expect(line1[0]).to.be.eq('mednova.com.cn  http    -1')

            const line2 = readTaskLines(fileName,true);
            expect(line2).have.lengthOf(4);
            expect(line2[0]).to.be.eq('aek56.com  http    -1')
        })

    })
})