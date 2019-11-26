/* eslint-disable no-undef */
const { DirTaskManager } = require('../../libs/toucan-utility');
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');

describe('[测试入口] - dir task manager', () => {
    const dbPath = path.resolve(process.cwd(), '.cache', 'test-dir-task-mgr');
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });
    const sourceName = 'dirtask测试';

    const srcArray = [{
        dbPath,
        sourceName
    }];
    const mgr = new DirTaskManager(srcArray, { taskFileExt: '.tsk', contentFileExt: '.txt' });

    beforeEach('', () => {
        prepareTaskFile('1688.v2', dbPath);
    })


    it('构造测试', () => {
        expect(mgr.sourceArray).to.be.eql(srcArray);
        expect(mgr.options.taskFileExt).to.be.eq('.tsk');
    })

    it('getTask', () => {
        const tasks = mgr.getTask();
        expect(tasks).have.lengthOf(1);

        const task = tasks[0];
        expect(task.sourceName).to.be.eq(sourceName);
        expect(task.contentFile).to.be.eq(path.resolve(dbPath, '1688.v2.txt'));
    })

    it('moveTask', () => {
        const task = mgr.getTask()[0];
        mgr.moveTask(task, 'test');

        expect(fs.existsSync(task.taskFile),'taskFile').is.false;
        expect(fs.existsSync(task.contentFile),'contentFile').is.false;

        expect(fs.existsSync(path.resolve(dbPath, 'test', '1688.v2.tsk')),'target taskFile').is.true;
        expect(fs.existsSync(path.resolve(dbPath, 'test', '1688.v2.txt')),'target contentFile').is.true;

    })
})

function prepareTaskFile(fileName, targetPath) {
    const srcFileName = path.resolve(__dirname, './sample', fileName);
    const targetFileName = path.resolve(targetPath, fileName);

    fs.copyFileSync(srcFileName + '.tsk', targetFileName + '.tsk', fs.constants.COPYFILE_FICLONE);
    fs.copyFileSync(srcFileName + '.txt', targetFileName + '.txt', fs.constants.COPYFILE_FICLONE);
}