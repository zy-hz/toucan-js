#
# 创建采集站点的注册表
#

/*==============================================================*/
/* Table: gs_regist                                             */
/*==============================================================*/
create table  gs_regist
(
   stationId            char(32) not null default '' comment '站点标记',
   stationHostName      char(32) not null default '' comment '站点所在的主机名称',
   stationIp            char(32) default '' comment '站点上次注册的ip地址',
   statioinToken        char(32) default '',
   createOn             datetime not null default '0001-01-01 00:00:00' comment '创建时间，管理员创建后，运行站点来注册',
   createBy             char(32) default '' comment '创建人标识',
   registOn             datetime default '0001-01-01 00:00:00' comment '站点注册的时间',
   enableReset          bool default 0 comment '允许用重新注册',
   autoId               bigint not null auto_increment comment '自动编号',
   primary key (autoId)
);

alter table gs_regist comment '采集站注册表';

/*==============================================================*/
/* Index: idx_station                                           */
/*==============================================================*/
create unique index  idx_station on gs_regist
(
   stationId,
   stationHostName
);
