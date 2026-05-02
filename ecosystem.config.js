module.exports = {
    apps: [
        {
            name: 'md-blog',
            script: 'server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            // Logging
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: false,
            // Restart behaviour — don't restart-loop if crashing on startup
            min_uptime: '10s',
            max_restarts: 5,
            restart_delay: 3000,
            kill_timeout: 5000
        }
    ]
}
