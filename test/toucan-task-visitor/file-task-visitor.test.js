/* eslint-disable no-undef */
const expect = require('chai').expect;
const tvFactory = require('../../libs/toucan-task-visitor');
const _ = require('lodash');
const {sleep} = require('../../libs/toucan-utility');

describe('FileTaskVisitor 测试', () => {
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

        it('间隔再次读取 等待6000ms',async()=>{
            let task = await tv.readTaskSync();
            expect(task).have.lengthOf(0);

            await sleep(6000);
            task = await tv.readTaskSync();
            expect(task[0].taskBody.targetUrl).to.be.eq('mednova.com.cn');
        });

    })

})