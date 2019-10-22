/* eslint-disable no-undef */
const ElmPageFetch = require('../../../libs/toucan-page-fetch/sp/_elm');

describe('饿了么浏览器抓手测试', () => {

    describe('准备', () => {

        it('prepare', async () => {
            const pageFetch = new ElmPageFetch();
            await pageFetch.prepare({
                // 启动调试
                devtools:false,
                // 用户的设备,默认iPhone 6,注意区分大小写
                userDevice:'iPhone 8',
                // 指定用户目录，保存登录信息
                // 注意：实际的数据是存储在该目录下的Default目录中
                userDataDir:`${process.cwd()}/.cache/userdata_ele.me`,
                // 收货地址的经纬度 - 万福中心
                latitude:30.182738530504807,
                longitude:120.20989357235537,
            });
        })
    })
})