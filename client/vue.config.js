const path = require('path')
 
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        // proxy: process.env.VUE_DEV_MOCK_SERVER
        proxy: 'http://127.0.0.1:8081'
    },
    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
            .set('views', resolve('src/views'))
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
}