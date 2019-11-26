/* eslint-disable no-undef */
const ElmShopListSpider = require('../../../libs/toucan-spider/toucan.sp/_elm-shop-list');
const { BaiduMapGeocoding } = require('../../../libs/web-api');
const lib = require('rewire')('../../../libs/toucan-spider/toucan.sp/_elm-shop-list');
const buildNextUrl = lib.__get__('buildNextUrl')
const { exURL } = require('../../../libs/toucan-utility');
const fs = require('fs');
const expect = require('chai').expect;
const _ = require('lodash');

describe('[demo] elm shop list 测试 ', () => {
    describe('内部函数 ', () => {

        const spider = new ElmShopListSpider({
            geoApi: createGeoApi(),
        });

        it('rebuildTargetUrl', async()=>{
            const url = await spider.rebuildTargetUrl({ targetUrl: '万福中心	0	30.182738530504807	120.20989357235537' });  
            const queryObj = exURL.getQuery(url);
            expect(queryObj.latitude - 0).to.be.eq(30.182738530504807);
            expect(queryObj.longitude - 0).to.be.eq(120.20989357235537);
        })

        it('buildQueryUrl', async () => {
            const url = await spider.buildQueryUrl({ address: '三江商厦' });
            const queryObj = exURL.getQuery(url);
            expect(queryObj['offset'] - 0).to.be.eq(0);
            expect(queryObj.limit - 0).to.be.eq(30);
            expect(queryObj.latitude - 0).is.greaterThan(30);
            expect(queryObj.longitude - 0).is.greaterThan(120);
        });

        it('buildNextUrl', () => {
            const url1 = 'https://h5.ele.me/restapi/shopping/v3/restaurants?latitude=22.533719&longitude=113.936091&keyword=&offset=0&limit=30&extras[]=activities&extras[]=tags&terminal=h5';
            const url2 = 'https://h5.ele.me/restapi/shopping/v3/restaurants?latitude=22.533719&longitude=113.936091&keyword=&offset=30&limit=30&extras[]=activities&extras[]=tags&terminal=h5'

            expect(buildNextUrl(url1)).to.be.eq(url2);
        })

    })

    describe('运行测试 ', () => {
        const spider = new ElmShopListSpider({
            geoApi: createGeoApi(),
            //cookie: `ubt_ssid=16ipgad3q9nrbzduofbzdbmo6sfyqnti_2019-10-13; perf_ssid=a45yky87xe17179qcmbao8mcbc5fs8k8_2019-10-13; ut_ubt_ssid=vizvfzfzzve48rp4et7u4147uavd7i95_2019-10-13; cna=agsjFqG8IQcCAXPAvvfwRjPp; _bl_uid=4Okpw11bo1aqwIxnvyta9tkxtvtj; _utrace=905997f34d4ed522c6143b644c0ab004_2019-10-13; track_id=1571412555|c10e7951c1343ce4381087ebfb489164060b3fdeb2566782c1|89f21ac75103c5f4bc43d150bce28545; USERID=16130211; UTUSER=16130211; SID=PaZ9fW0lf8My0j5GuXC79S36DFTQ0ZGQXyUg; ZDS=1.0|1571412555|iwUj9uQFUdXH48NMMJqb8Tm9DrdwOCPH8bq3noCrvyd95JP+ZVgiMVZ/GOvUab4a; l=dBgHrxCRq-A5tfi9BOCw5uI8LobOSIRA_uPRwCYXi_5ZO6Y1OObOkGaDQFv6VjWfMQLB4cULngv9-etki84GPSFTXe47PxDc.; isg=BLa23vzv96im3IPHtNV1X8OuB-x4f_t1GU9u4SCfohk0Y1b9iGdKIRwRe3-qTPIp; tzyy=25a4d90605425eb4514f0457b6d0199c; pizza73686f7070696e67=1MkK5-oAczE99P7yXnEoaO2AALnMTZr7afhe69ov_VLgfXLNcuEdSbpLtq10GVhc`
            //cookie:`ubt_ssid=16ipgad3q9nrbzduofbzdbmo6sfyqnti_2019-10-13; perf_ssid=a45yky87xe17179qcmbao8mcbc5fs8k8_2019-10-13; ut_ubt_ssid=vizvfzfzzve48rp4et7u4147uavd7i95_2019-10-13; cna=agsjFqG8IQcCAXPAvvfwRjPp; _bl_uid=4Okpw11bo1aqwIxnvyta9tkxtvtj; _utrace=905997f34d4ed522c6143b644c0ab004_2019-10-13; track_id=1571412555|c10e7951c1343ce4381087ebfb489164060b3fdeb2566782c1|89f21ac75103c5f4bc43d150bce28545; USERID=16130211; UTUSER=16130211; SID=PaZ9fW0lf8My0j5GuXC79S36DFTQ0ZGQXyUg; ZDS=1.0|1571412555|iwUj9uQFUdXH48NMMJqb8Tm9DrdwOCPH8bq3noCrvyd95JP+ZVgiMVZ/GOvUab4a; tzyy=25a4d90605425eb4514f0457b6d0199c; isg=BAgI4QiWwYFQWi0NlnOjJYHw2XbaGW3fG0EAq8K5-AN2nagHasMRSi_cFTVIrSST; l=dBgHrxCRq-A5tzvGBOfaCuI8LobTPIRb4sPzw4OGqICPOKC95u8CBZIZwK8pCnGVh6r2R3oTJ-juBeYBq_HGt-kNhm8WY9Mmn; pizza73686f7070696e67=1MkK5-oAczE99P7yXnEoaKfOzIrb0BcNUF6H0ufP46TkizpHefhT8f3QB57g-LBg`
            cookie:`pizza73686f7070696e67=1MkK5-oAczE99P7yXnEoaKP1PCqRznMTlDuc9n9MBayUK76thumJHA; ut_ubt_ssid=zt120d35w4ilko2y7tu47c96e6vbanoh_2019-10-19; perf_ssid=l4nq091l0n18whn580rbf5tacfeza3ga_2019-10-19; ubt_ssid=hiqgsbw1o9mq496dbaspizwodn7ty73v_2019-10-19; cna=PdMxFhhrWD0CAdy/J2DKXugM; _utrace=2eea16af35d40ee4889a39f290da8de0_2019-10-19; track_id=1571480972|8f440f660237c07ed1c78c88c95f3c8f9223cc2cd00f279ce2|058592f44e0298927725044e630f29f6; USERID=16130211; UTUSER=16130211; SID=MgN853Tskxff0vvGN05VgRSh1CrfhwuIHm4g; ZDS=1.0|1571480972|3Xj8Del1db+ZRBS8D80vvhNAalhYLAPsdLS5AUhHOmu4g/iQ2y/p+HrXcbu/MkKO; isg=BIqKZuQL42_V_m_LoOnBGz9K23Ds0w-xr3mEXhTDNl1oxyqB_Ate5dA103W-N4Zt`
        });

        it('采集1页', async () => {

            const task = { city: '上海', address: '上海火车站' }
            const result = await spider.run(task, async ({  page }) => {
                expect(page.hasException, 'hasException').is.false;
                expect(_.isEmpty(page.pageContent), 'pageContent').is.false;

                const shopList = JSON.parse(page.pageContent);
                expect(shopList.has_next, 'has_next').is.true;
                expect(shopList.items.length, 'items length').is.greaterThan(1);
            });

            expect(result.taskDonePageCount,'pageDoneCount').to.be.eq(1);
        });

        it('采集3页', async () => {
            console.log('准备采集3页elm店铺列表...')
            const task = { city: '杭州', address: '三江商厦', depth: 2 }
            const result = await spider.run(task, async ({  page }) => {
                console.log(`采集${page.pageLayerIndex + 1}页成功`);
                expect(page.hasException, 'hasException').is.false;
                expect(_.isEmpty(page.pageContent), 'pageContent').is.false;

                const shopList = JSON.parse(page.pageContent);
                expect(shopList.has_next, 'has_next').is.true;
                expect(shopList.items, 'items length').is.lengthOf(30);
            });

            expect(result.taskDonePageCount, 'taskDonePageCount').to.be.eq(3)
        });

        it('所有页', async () => {
            console.log('准备采集所有页elm店铺列表...')
            const task = { city: '杭州', address: '三江商厦', depth: 999, startPageIndex: 18 }
            await spider.run(task, async ({ page }) => {
                console.log(`采集${page.pageLayerIndex + 1}页成功`);

                expect(_.isEmpty(page.pageContent), 'pageContent').is.false;
                const shopList = JSON.parse(page.pageContent);

                if (!page.has_next) {
                    console.log('这是最后一页');
                    console.log('shopList.items',shopList.items);
                } else {
                    expect(shopList.items, 'items length').is.lengthOf(30);
                }

            });

        })
    })
})

function createGeoApi() {
    return new BaiduMapGeocoding(getAppKey());
}

function getAppKey() {
    const fileName = `${process.cwd()}/.sample/baidu/appkey.json`;
    return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
}