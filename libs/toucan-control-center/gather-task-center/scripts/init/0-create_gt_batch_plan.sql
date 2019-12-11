#
# 批次采集计划表
#

/*==============================================================*/
/* Table: gt_batch_plan                                         */
/*==============================================================*/
create table gt_batch_plan
(
   batchId              bigint not null comment '批次编号',
   runCount             smallint not null default 0 comment '运行次数',
   createOn             datetime default '0001-01-01 00:00:00' comment '创建时间',
   runPlan              char(32) default '' comment '运行计划',
   batchOptions         varchar(1024) default '' comment '批次的工作选项',
   lastQueueOn          datetime default '0001-01-01 00:00:00' comment '上次排队时间',
   nextQueueOn          datetime default '0001-01-01 00:00:00' comment '下次排队时间',
   beginOn              datetime default '0001-01-01 00:00:00' comment '开始时间',
   isEnd                bool default 0 comment '是否结束',
   endOn                datetime default '0001-01-01 00:00:00' comment '结束时间',
   spendTime            int default 0 comment '花费的时间，单位秒',
   lastResultOn         datetime default '0001-01-01 00:00:00' comment '最近提交结果的时间',
   taskQueueCount       int default 0 comment '任务排队的数量',
   taskDoneCount        int default 0 comment '任务完成数量',
   taskErrorCount       int default 0 comment '任务错误数量',
   taskResidualCount    int default 0 comment '任务剩余数量',
   taskDoneRate         numeric(5,2) default 0.00 comment '完成率',
   taskErrorRate        numeric(5,2) default 0.00 comment '错误率',
   homeId               bigint default 0 comment '一个原始批次被拆分后，使用该字段进行合并',
   autoId               bigint not null auto_increment,
   primary key (batchId, runCount),
   key AK_Key_1 (autoId)
);

alter table gt_batch_plan comment '采集任务批次工作计划表';

/*==============================================================*/
/* Index: idx_homeid                                            */
/*==============================================================*/
create index idx_homeid on gt_batch_plan
(
   homeId
);

/*==============================================================*/
/* Index: idx_nextrun                                           */
/*==============================================================*/
create index idx_nextrun on gt_batch_plan
(
   nextQueueOn
);
