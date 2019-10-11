/* eslint-disable no-undef */
const Ali1688DetailSpider = require('../../../libs/toucan-spider/toucan.sp/_ali-1688-detail');
const expect = require('chai').expect;
const { exHTML } = require('../../../libs/toucan-utility');

describe('[long]ali-1688-detail 蜘蛛测试 ', () => {
    const url1 = 'https://detail.1688.com/offer/602752160064.html?spm=a260j.12536015.jr601u7p.2.145d700eMEM6by';

    it('m', async () => {
        const spider = new Ali1688DetailSpider();
        const task = await spider.run({ targetUrl: url1, useMobile: true }, ({ task, page }) => {
            expectPage(page);
        });

        expectTask(task);
    });

    it('pc', async () => {
        const spider = new Ali1688DetailSpider();
        const task = await spider.run({ targetUrl: url1, useMobile: false, headless: false }, ({ task, page }) => {
            expectPage(page);
        });

        expectTask(task);
    })

});

function expectTask(task) {
    expect(task.taskDonePageCount, 'taskDonePageCount').to.be.eq(1);
    expect(task.taskErrorPageCount, 'taskErrorPageCount').to.be.eq(0);
    expect(task.taskSpendTime, 'taskSpendTime').is.greaterThan(0);
}

function expectPage(page) {
    expect(page.hasException).is.false;
    const content = exHTML.extractContent(page.pageContent, true);
    expect(content.indexOf('莎诺国际G4642图片包百度网盘下载') > 0).is.true;
}