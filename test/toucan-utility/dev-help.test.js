/* eslint-disable no-undef */
const { getConstFromTableFields } = require('../../libs/toucan-utility');
describe('[测试入口] - dev help', () => {

    it('run onces', () => {
        const fields = `   batchId              bigint not null comment '批次编号',
        batchName            char(32) default '' comment '批次的名称',
        batchComment         varchar(1024) default '' comment '批次的备注',
        batchOwner           char(16) comment '批次的所有人',
        batchGroup           char(16) comment '批次所在组',
        batchTag             varchar(1024) default '' comment '批次的标签',
        batchSource          char(16),
        taskCount            int default 0 comment '批次的任务数量',
        runCount             int default 0 comment '运行次数',
        createOn             datetime default '0001-01-01 00:00:00' comment '创建时间',`;

        console.log(getConstFromTableFields(fields));
    })
})