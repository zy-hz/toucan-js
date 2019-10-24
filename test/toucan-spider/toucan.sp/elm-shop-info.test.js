/* eslint-disable no-undef */
const ElmShopInfoSpider = require('../../../libs/toucan-spider/toucan.sp/_elm-shop-info');
const expect = require('chai').expect;
const _ = require('lodash');
const fs = require('fs');

describe('elm shop info 测试 temp', () => {

    describe('运行测试', () => {
        const spider = new ElmShopInfoSpider();
        const deviceInfo = {
            // 启动调试
            devtools: false,
            // 用户的设备,默认iPhone 6,注意区分大小写
            userDevice: 'iPhone 8',
            // 指定用户目录，保存登录信息
            // 注意：实际的数据是存储在该目录下的Default目录中
            userDataDir: `${process.cwd()}/.cache/userdata_ele.me`,
        }
        const expectTask = { location: '万福中心', latitude: 30.182738530504807, longitude: 120.20989357235537 };

        it('', async () => {
            const result = await spider.run(Object.assign(expectTask, deviceInfo), ({ task, page }) => {
                console.log(`采集${page.pageLayerIndex + 1}页成功`);

                expect(page.hasException, 'hasException').is.false;
                expect(_.isEmpty(page.pageContent), 'pageContent').is.false;

                console.log('shopInfo', page.shopInfo);

                const line = JSON.stringify({ shopInfo: page.shopInfo, products: page.products }) + '\r\n';
                fs.appendFileSync(`${process.cwd()}/.cache/elm.result`, line);
            });

            if (result.hasException) {
                const {
                    // 错误信息
                    message,
                    // 调用堆栈
                    stack } = result;
                console.log(message, stack);
            }
        })
    })
})