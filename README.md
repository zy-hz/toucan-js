# 大嘴鸟 javascript 通用库

准备一些常用的轮子，拼装起来完成一些大型的工作

## 安装

1. 在目录<mydir>中解开压缩包，解压缩成功后，<mydri>目录中有以下文件夹和文件

   ```
   libs
   init.js
   package.json
   pm2.config.js
   READEM.md
   start.js
   ```

   **注意：以下命令必须在<mydir>目录中运行**

2. 在<mydir>目录中打开命令窗口，运行 npm install -g cnpm --registry=https://registry.npm.taobao.org

3. 在<mydir>的命令窗口中运行 cnpm install (使用淘宝镜像安装速度快50%)

4. 在<mydir>的命令窗口中运行 cnpm i pm2 -g , 安装pm2管理工具

5. 在<mydir>的命令窗口中运行 pm2 install pm2-logrotate，（注意是pm2 install 不是 npm install）

## 设置

1. 在<mydri>的上级目录中创建config目录，在config目录中，新建
   - gather-station-center.config.json，采集站点控制中心的配置文件。
   - gather-task-center.config.json ,采集任务控制中心的配置文件。

2. 在<mydir>目录运行 node init gsc|gtc , 分别初始化采集站点控制中心，采集任务控制中心

3. 修改pm2-logrotate下，需要用pm2 set，否在不会生效

   ```
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   pm2 set pm2-logrotate:workerInterval 30 
   ```


## 启动

1. 在目录<mydir>目录运行 node start gsc|gtc , 可以分别启动采集站控制中心，采集任务控制中心
2. 或者运行 pm2 start pm2.config.js --only gsc|gtc|gs

## 目录结构说明

| 目录名称 | 目录说明                                             |
| -------- | ---------------------------------------------------- |
| demo     | 一些使用示例，最好的上手指南                         |
| docs     | 开发中的设计文档，不看也罢。有蜘蛛配置指南，可以参考 |
| libs     | 库源码                                               |
| test     | 单元测试                                             |

## 功能

- 107 - 在采集结果中添加站点信息
- 106 - 采集任务管理中心数据库支持 
- 105 - 采集站点从管理中心获得运行配置
- 104 - 新增采集站管理中心
- 103 - 新增浏览器模式获得饿了么店铺信息
- 102 - 新增elm相关功能，饿了么店铺列表蜘蛛 （关闭：不能使用api访问）

## 问题

- 100 - 上传超大文件，大于100万记录的时候，大概率出现导入异常

## 测试方案

采用mock为测试框架，设置4类测试方案：

1. 临时测试方案，标记为 temp

   该方案是在开发过程中使用，在descript或者it中标题中添加temp标记。同时在启动时，选择“Temp 测试指定用例 ”。

2. 快速测试方法，标记为空

   该方案时默认方案。启动时，选择“Fast 测试 ”。一些必要的，基础的测试，一定需要覆盖的测试。如果发现错误，就立刻停止。

3. 长时间测试方案，标记为[long]

   该方案用来标记花费比较长时间的测试用例，在descript或者it中标题中添加long标记。同时在启动时，选择“Long 测试 ”。如果发现错误，还继续进行，直到所有标记为long的测试用例执行完毕。

4. 演示方案（忽略测试），标记为[demo]

   如果只希望在调试阶段使用，而在全面测试用不使用，可以在descript或者it中标题中添加demo标记。这样在其他测试中就会被忽略

5. 全面测试

   该方案时快速测试+长时间测试的方案总和。测试过程中会发现错误后，记录错误后跳过，最后给出一个综合报告

## 采集任务管理中心 gtc

​	复制导入，调度，发布采集任务。

## 采集站点管理中心 gsc



