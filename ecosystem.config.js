module.exports = {
    apps: [
        {
            name: 'md-blog',
            script: 'server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
            env_production: {
                NODE_ENV: 'production'
            },
            // Logging
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: '/root/.pm2/logs/md-blog-error.log',
            out_file: '/root/.pm2/logs/md-blog-out.log',
            merge_logs: true,
            // Restart behaviour — don't restart-loop if crashing on startup
            min_uptime: '10s',
            max_restarts: 5,
            restart_delay: 3000
        }
    ]
}
