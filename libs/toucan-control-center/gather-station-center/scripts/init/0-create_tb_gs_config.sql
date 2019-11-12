#
# 创建采集站点的配置表
#

/*==============================================================*/
/* Table: gs_config                                             */
/*==============================================================*/
create table gs_config
(
   configId             char(36) default '' comment '配置方案的编号',
   configComment        varchar(1024) comment '备注',
   configBody           varchar(1024) comment '配置内容-json',
   createOn             datetime default '0001-01-01 00:00:00',
   modifyOn             datetime default '0001-01-01 00:00:00',
   applyCount           int default 0 comment '应用的次数',
   autoId               bigint not null auto_increment,
   primary key (autoId)
);

alter table gs_config comment '采集站点配置方案表';

/*==============================================================*/
/* Index: idx_planid                                            */
/*==============================================================*/
create unique index idx_planid on gs_config
(
   configId
);
