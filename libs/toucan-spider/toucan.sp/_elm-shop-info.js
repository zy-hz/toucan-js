//
// 饿了么店铺信息蜘蛛
//
// 步骤
// 1. 登录（尝试用cookie恢复），到elm的首页
// 2. 输入一些地址（小区，楼道），获取附近的店铺（滑动便利）
// 3. 点击进入店铺
//

//
// 采集目标
//
// 一、店铺首页，鼠标移动到左上角区域，下滑出的界面中有若干字段，采集存下。
// 二、在商家资质中，有图片，部分有文字信息，采集图片数量（图片链接），采集文字信息。
//
const _ = require('lodash');
const { ToucanBaseSpider } = require('../_base-spider');
const ElmPageFetch = require('../../toucan-page-fetch/sp/_elm');
const { getFoodEntryIds, analyzeShopListPage, analyzeShopHomePage } = require('../../toucan-page-fetch/sp/_elm-page-anlayze');
const { sleep, SiteUrlCount } = require('../../toucan-utility');
const { onException } = require('../../toucan-page-fetch/_fetch-exception');

class ElmShopInfoSpider extends ToucanBaseSpider {
    // 构造
    constructor(options = {}) {
        super(options);

        // 构造蜘蛛使用的页面抓手-饿了么专用抓手
        this.options = options;
        this.pageFetch = new ElmPageFetch(options);
    }

    async run(
        // 采集任务的参数
        task,
        // 提交采集的结果
        submitGatherResult
    ) {

        // 任务开始时间
        let theTask = Object.assign(task,
            {
                taskBeginTime: _.now(),
                taskDonePageCount: 0,
                taskErrorPageCount: 0,
                extractUrlTotalCount: SiteUrlCount(),
                extractUrlErrorCount: 0,
                //depth: maxLayerIndex,
                // 指定用户目录，保存登录信息
                // 注意：实际的数据是存储在该目录下的Default目录中
                userDataDir: `${process.cwd()}/.cache/userdata_ele.me`
            },
            // 添加额外的信息
            await this.resolveTask(task),
        );

        try {
            // 开始正式采集店铺信息前，需要保证浏览器已经处于登录状态（手工登录|自动登录|cookie恢复）
            // 位置信息：latitude, longitude 必须存在
            if (theTask.latitude === 0 || theTask.longitude === 0) throw Error(`${theTask.address}没有正确的经纬度信息`);
            const { pageContent } = await this.pageFetch.prepareWaitSuccess(theTask);

            // 获得需要爬行的食物分类入口
            const FoodEntry = getFoodEntryIds(pageContent);
            for await (const id of FoodEntry) {
                await this.crawlFoodEntry(id, theTask, submitGatherResult);
            }
        }
        catch (error) {
            theTask = Object.assign(theTask, onException(error));
        }
        finally {
            // 尝试关闭页面抓手
            await this.pageFetch.close();
        }

        await sleep(3000);
        // 设置任务完成得信息
        return this.onTaskDone(theTask);
    }

    // 爬行食物分类入口
    // tap id所在的标签，导航到指定的分类中，滚动页面获得店铺列表
    // id 类似：div[ubt-data-title='美食']
    async crawlFoodEntry(id, task, submitGatherResult) {

        // 在这里可以指定最大获得店铺的数量，店铺的排序等参数
        const result = await this.pageFetch.doFoodEntry(id, task);

        // 分析点列表店铺列表 - 店铺的class 例如：ndex-container_10L_lQb shop-0
        const { shops } = analyzeShopListPage(result.pageContent);
        let pageLayerIndex = 0;
        for await (const shop of shops) {
            // 进入后，需要等待，否在店铺连接可能还没有出现
            await sleep(2000);

            // 设置页面对象
            let thePage = {
                pageUrl: id,
                pageBeginTime: _.now(),
                pageLayerIndex,
                spiderName: this.spiderName,
                spiderType: this.spiderType
            }

            const response = await this.crawlShop(shop.shopClass, task, submitGatherResult);
            thePage = Object.assign(thePage, response);

            // 触发一个页面完成
            await this.onPageDone(false, task, thePage, {}, submitGatherResult);

            // 准备下一个连接
            pageLayerIndex = pageLayerIndex + 1;
        }
    }

    // 爬行店铺 
    // 在店铺列表中点击id,转到店铺页面
    // 注意：开始点击前需要保证当前页面是店铺列表页面，且店铺class在页面中存在
    // 
    // id 类似 ndex-container_10L_lQb shop-0，是店铺的class
    async crawlShop(id, task) {

        // 获得店铺的首页
        const result = await this.pageFetch.doShopHome(id, task);

        // 分析页面获得产品和其他可以点击的按钮
        // { pageContent: result.pageContent }
        return Object.assign({}, analyzeShopHomePage(result.pageContent));
    }

    // 解析任务
    async resolveTask(task) {
        const { targetUrl } = task;
        if (_.isNil(targetUrl)) return {};

        const pms = _.split(targetUrl, '\t');
        if (pms.length < 4) return targetUrl;

        return { address: pms[0], latitude: _.toNumber(pms[2]), longitude: _.toNumber(pms[3]) };
    }
}

module.exports = ElmShopInfoSpider;