#
# 批次详情表
#

/*==============================================================*/
/* Table: gt_batch_u                                            */
/*==============================================================*/
create table gt_batch_u
(
   batchId              bigint not null comment '批次编号',
   taskId               bigint not null auto_increment comment '任务编号',
   taskState            smallint default 0 comment '0-ready,1-reset,10-queue,20-done,21-error',
   taskBody             varchar(1024) default '' comment '任务体，json',
   preTaskId            bigint default 0 comment '上一级任务编号',
   rootTaskId           bigint default 0 comment '根任务的编号',
   runCount             smallint default 0 comment '运行次数，推入队列次数',
   resetCount           smallint default 0 comment '重置次数，（不包括整批重置）',
   doneCount            int default 0 comment '完成次数',
   errorCount           int default 0 comment '错误的次数',
   beginOn              datetime default '0001-01-01 00:00:00' comment '任务开始时间，进入队列',
   endOn                datetime default '0001-01-01 00:00:00' comment '任务结束时间',
   processTime          int default 0 comment '进程花费时间',
   workTime             int default 0 comment '实际工作时间',
   primary key (batchId, taskId),
   key AK_Key_1 (taskId)
);

alter table gt_batch_u comment '采集任务详情表，每批任务独立一个表';
