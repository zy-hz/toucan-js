//
// 使用mysql方式存储采集结果
//
const _ = require('lodash');
const { DbVisitor, md5, currentDateTimeString } = require('../../toucan-utility');
const ToucanBaseResultStore = require('../_base-store');

class MysqlResultStore extends ToucanBaseResultStore {
    constructor(options) {
        super(options);
    }

    async init(options = {
        // 数据库对象
        dbConnection: {},
        // 存储的表名
        tableName: '',
        // 新建表，'' | day | week | month
        newTableWhen: '',
    }
    ) {
        this.dbv = new DbVisitor(options.dbConnection);
        this.storeTableName = getStoreTableName(options.tableName, options.newTableWhen);
        const createSql = getCreateTableSql(this.storeTableName);
        await this.dbv.execSql(createSql);
    }

    // 关闭存储器
    async close() {
        if (_.isNil(this.dbv)) return;

        await this.dbv.close();
    }

    // 存储器的接口
    async save(msg) {
        const ary = _.castArray(msg);
        for await (const m of ary) {
            const { task = {}, page = {} } = m;
            const { pageContent = '', overSize = 0 } = trimPageContent(page.pageContent);

            const pageMD5 = md5(pageContent);
            const existPage = await this.dbv.DB(this.storeTableName).select().where({ pageMD5 });
            let outPageCount = _.isEmpty(existPage) ? pageContent : page.pageUrl;

            // 标识页面已经访问过了
            m.hasVisited = !_.isEmpty(existPage);

            if(!_.isEmpty(task.storeTableName)){
                const createSql = getCreateTableSql(task.storeTableName);
                await this.dbv.execSql(createSql);
            }

            await this.dbv.insert(task.storeTableName || this.storeTableName, {
                batchId: task.batchId,
                taskId: task.taskId,
                runCount: task.runCount,
                pageUrl: page.pageUrl,
                hasException: page.hasException,
                hasVisited: m.hasVisited,
                pageSpendTime: page.pageSpendTime,
                pageContent: outPageCount,
                pageMD5,
                createOn: currentDateTimeString(),
                overSize

            })
        }

        return ary;
    }
}

// 裁剪内容，保证能存入数据库 16MB
function trimPageContent(content, maxSize = 1024 * 1024 * 16) {
    if (_.isEmpty(content)) return {};

    const len = _.size(content);
    return { pageContent: content.substr(0, maxSize - 1), overSize: Math.max(0, len - maxSize) }
}

function getStoreTableName(tableName) {
    if (_.isEmpty(tableName)) return 'tc_comm_gather_result';
    return tableName;
}

// 创建表的sql
function getCreateTableSql(tableName) {
    return `create table if not exists ${tableName}
    (
        batchId              bigint not null comment '批次编号',
        taskId               bigint not null default 0 comment '任务编号',
        runCount             smallint default 0 comment '运行次数，推入队列次数',
        createOn             datetime default '0001-01-01 00:00:00' comment '创建日期',
        pageUrl              varchar(1024) default '' comment '页面地址',
        hasException         bool default 0 comment '是否有异常',
        hasVisited           bool default 0 comment '页面是否已经访问过了',
        pageSpendTime        int default 0 comment '采集花费时间',
        pageContent          mediumtext comment '页面内容 ',
        pageMD5              char(32) default '',
        overSize             int default 0 comment '超长的数量（单位k）',
        autoId               bigint not null auto_increment,
        primary key (autoId),
        key AK_Key_2 (pageMD5)
    );`
}

module.exports = MysqlResultStore;