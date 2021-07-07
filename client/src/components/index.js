import Vue from 'vue'

const requireContext = require.context(
    // 其组件目录的相对路径
    './global',
    // 是否查询其子目录
    true,
    // 匹配基础组件文件名的正则表达式
    /\.vue$/
)

requireContext.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireContext(fileName)
    Vue.component(
        componentConfig.default.name || componentConfig.name,
        componentConfig.default || componentConfig
    )
})