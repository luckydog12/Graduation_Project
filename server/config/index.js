module.exports = {
    db: {
        database: 'graduation',
        username: 'root',
        password: '123456',
        options: {
            host: 'localhost',
            dialect: 'mysql',
            timezone: '+08:00',
            define: {
                // 不使用驼峰式命令规则，这样会在使用下划线分隔
                // 这样 updatedAt 的字段名会是 updated_at
                underscored: true,
            }
        }
    },
    token: {
        secretOrPrivateKey: 'graduation',
        options: {
            expiresIn: '24h'
        }
    }
}