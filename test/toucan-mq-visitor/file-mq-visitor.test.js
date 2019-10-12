/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const lib = require('rewire')('../../libs/toucan-mq-visitor/_file-mq-visitor');
const DEFAULT_CACHE_PATH = lib.__get__('DEFAULT_CACHE_PATH');

const fs = require('fs');

describe('FileMQVisitor 测试 ', () => {

    describe('init', () => {
        it('default path', () => {
            mqvCreate('file');
            expect(fs.existsSync(DEFAULT_CACHE_PATH), 'DEFAULT_CACHE_PATH').is.true;
        });

        it('task source temp', () => {
            // 清除缓存
            const cacheFileName = `${DEFAULT_CACHE_PATH}/sp.ali.1688.detail`;
            if(fs.existsSync(cacheFileName)) fs.unlinkSync(cacheFileName);

            const queueName = 'sp.ali.1688.detail';
            const mqv = mqvCreate('file', {
                // 指定采集任务
                gatherTaskQueue: [{ queueName, srcFilePath: `${process.cwd()}/.sample/ali.1688.detail_s.txt` }]
            });
            expect(fs.existsSync(DEFAULT_CACHE_PATH), 'DEFAULT_CACHE_PATH').is.true;
            expect(mqv.__dataStorage__[queueName]).have.lengthOf(12,`${queueName} 队列长度`);
        });
    });
})