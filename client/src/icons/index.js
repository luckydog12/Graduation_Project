import Vue from 'vue'
import Svg from '@/components/Svg'// svg组件

// register globally
Vue.component('v-icon', Svg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)