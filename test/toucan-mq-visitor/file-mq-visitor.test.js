/* eslint-disable no-undef */
const expect = require('chai').expect;
const mqvCreate = require('../../libs/toucan-mq-visitor');
const lib = require('rewire')('../../libs/toucan-mq-visitor/_file-mq-visitor');
const DEFAULT_CACHE_PATH = lib.__get__('DEFAULT_CACHE_PATH');

const fs = require('fs');

describe('FileMQVisitor 测试', () => {

    describe('init', () => {
        it('default path', () => {
            mqvCreate('file');
            expect(fs.existsSync(DEFAULT_CACHE_PATH), 'DEFAULT_CACHE_PATH').is.true;
        });

        it('task source', async () => {
            // 清除缓存
            const cacheFileName = `${DEFAULT_CACHE_PATH}/sp.ali.1688.detail`;
            if (fs.existsSync(cacheFileName)) fs.unlinkSync(cacheFileName);

            const queueName = 'sp.ali.1688.detail';
            const mqv = mqvCreate('file', {
                // 指定采集任务
                gatherTaskQueue: [{ 
                    queueName, 
                    srcFilePath: `${process.cwd()}/.sample/ali.1688.detail_s.txt`,
                    urlFormat:'https://detail.1688.com/{$0}.html',
                 }]

            });
            expect(fs.existsSync(DEFAULT_CACHE_PATH), 'DEFAULT_CACHE_PATH').is.true;
            expect(mqv.__dataStorage__[queueName]).have.lengthOf(12, `${queueName} 队列长度`);

            let msg = mqv.__dataStorage__[queueName][0];
            expect(msg.content.targetUrl).to.be.eq('https://detail.1688.com/44271923808.html');
            expect(msg.isRead).is.false;
            
            // 模拟获取一个任务
            mqv.read({ queue: queueName });
            // 期望缓存数据写入磁盘
            await mqv.disconnect();

            // 重新初始化
            mqv.init();
            expect(mqv.__dataStorage__[queueName]).have.lengthOf(12, `${queueName} 队列长度2`);

            msg = mqv.__dataStorage__[queueName][0];
            expect(msg.content.targetUrl).to.be.eq('https://detail.1688.com/44271923808.html');
            expect(msg.isRead,'已经读取').is.true;
        });
    });
})