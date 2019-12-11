#
# 采集任务批次表
#

/*==============================================================*/
/* Table: gt_batch                                              */
/*==============================================================*/
create table gt_batch
(
   batchId              bigint not null comment '批次编号',
   batchName            char(32) default '' comment '批次的名称',
   batchComment         varchar(1024) default '' comment '批次的备注',
   batchOwner           char(16) default '' comment '批次的所有人',
   batchGroup           char(16) default '' comment '批次所在组',
   batchTag             varchar(1024) default '' comment '批次的标签',
   batchSource          varchar(32) default '' comment '批次载入的来源',
   batchOptions         varchar(1024) default '' comment '批次的工作选项',
   taskCount            int default 0 comment '批次的任务数量',
   runCount             int default 0 comment '运行次数',
   createOn             datetime default '0001-01-01 00:00:00' comment '创建时间',
   homeId               bigint default 0 comment '一个原始批次被拆分后，使用该字段进行合并',
   runPlan              char(32) default '' comment '运行计划，cron',
   autoReset            bool default 0 comment '完成后自动重置',
   autoId               bigint not null auto_increment,
   primary key (batchId),
   key AK_Key_1 (autoId)
);

alter table gt_batch comment '采集任务批次表';

/*==============================================================*/
/* Index: idx_homeid                                            */
/*==============================================================*/
create index idx_homeid on gt_batch
(
   homeId
);
