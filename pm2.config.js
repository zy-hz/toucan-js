module.exports = {
  apps: [{
    name: 'gs',
    script: 'start.js',
    args: 'gs --remote 211.149.224.49:57701 --port 57721',
    instances: 1,
    autorestart: true,
    restart_delay: 5000,
    watch: false,
    max_memory_restart: '1G',
    error_file: '.logs/gs-pm2.err',
    out_file: '.logs/gs-pm2.log',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

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
