// 注意：这个文件名一定是.config.js作为结尾
//
module.exports = {
  apps: [
    // 采集站点（情报站）应用
    {
      name: 'gs',
      script: 'start.js',
      args: 'gs --remote 211.149.224.49:57701 --port 57721',
      instances: 1,
      autorestart: true,
      restart_delay: 5000,
      watch: false,
      max_memory_restart: '1G', //最大内存限制数,超出自动重启
      exec_mode: "cluster", //可选值fork,cluster(开启集群模式实现负载均衡),默认fork
      // 设置输出目录后，pm2-logrotate就不生效了（未确认）
      //error_file: '.logs/gs-err.log',
      //out_file: '.logs/gs-out.log',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    // 采集站点管理中心
    {
      name: 'gsc',
      script: 'start.js',
      args: 'gsc',
      instances: 1,
      autorestart: true,
      restart_delay: 1000,
      watch: false,
      max_memory_restart: '1G', //最大内存限制数,超出自动重启
      exec_mode: "cluster", //可选值fork,cluster(开启集群模式实现负载均衡),默认fork
    }
    ,    
    // 采集任务管理中心
    {
      name: 'gtc',
      script: 'start.js',
      args: 'gtc',
      instances: 1,
      autorestart: true,
      restart_delay: 1000,
      watch: false,
      max_memory_restart: '1G', //最大内存限制数,超出自动重启
      exec_mode: "cluster", //可选值fork,cluster(开启集群模式实现负载均衡),默认fork
    }
  ],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
