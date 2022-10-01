module.exports = {
    apps: [
        {
            name: 'api',
            script: 'api-gateway/dist/main.js'
        },
        {
            name: 'micro_admin_backend',
            script: 'micro-admin-backend/dist/main.js'
        },
        {
            name: 'micro_challenge',
            script: 'micro-challenge/dist/main.js'
        },
        {
            name: 'micro_ranking',
            script: 'micro-challenge/dist/main.js'
        }
    ]
}