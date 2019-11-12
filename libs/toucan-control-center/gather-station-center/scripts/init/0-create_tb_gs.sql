#
# 创建采集站点表
#

/*==============================================================*/
/* Table: gs                                                    */
/*==============================================================*/
create table gs
(
   stationId            char(32) not null default '' comment '站点标记',
   stationHostname      char(32) not null default '' comment '站点所在的主机名称',
   stationMD5           char(32) default '' comment '站点的md5码',
   stationKey           char(32) default '' comment '站点的访问令牌',
   stationIp            char(32) default '' comment '站点上次注册的ip地址',
   stationListenPort    int default 0,
   stationConfigPlanId  char(36) default '' comment '站点配置方法的编号',
   createOn             datetime not null default '0001-01-01 00:00:00' comment '创建时间，管理员创建后，运行站点来注册',
   createBy             char(32) default '' comment '创建人标识',
   registOn             datetime default '0001-01-01 00:00:00' comment '站点注册的时间',
   updateOn             datetime default '0001-01-01 00:00:00' comment '更新的时间',
   isLocked             bool default 0 comment '站点被锁定，不能使用',
   enableReset          bool default 0 comment '允许用重新注册',
   sysArch              char(32) default '' comment '系统架构',
   sysMemory            char(32) default '' comment '系统内存',
   sysPlatform          char(32) default '' comment '系统平台',
   sysRelease           char(32) default '' comment '操作系统版本',
   sysType              char(32) default '' comment '操作系统类型',
   autoId               bigint not null auto_increment comment '自动编号',
   primary key (autoId)
);

alter table gs comment '采集站点表';

/*==============================================================*/
/* Index: idx_station                                           */
/*==============================================================*/
create unique index idx_station on gs
(
   stationId,
   stationHostname
);
