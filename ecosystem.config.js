module.exports = {
    apps: [
        {
            name: 'menulink-api',
            script: 'src/index.js',
            instances: 1, // 1 seul sur t2.micro (1 core)
            autorestart: true,
            watch: false,
            max_memory_restart: '800M', // Redémarre si ça consomme trop de RAM (sur 1Go total)
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            error_file: './logs/pm2-error.log',
            out_file: './logs/pm2-out.log',
            merge_logs: true,
            time: true
        }
    ]
};
