<template>
    <div>
        <el-aside width="200px">
            <el-menu :default-active="$route.path" :unique-opened="true" background-color="#545c64" 
                text-color="#fff" active-text-color="#ffd04b" router>
                <div v-for="(item,index) in list" :key="index">
                    <el-submenu v-if="item.children && item.children.length" :index="item.path" :key="item.path">
                        <template slot="title">
                            <span>{{item.name}}</span>
                        </template>
                        <template v-for="itemChild in item.children">
                            <el-menu-item :index="item.path+itemChild.path" :key="itemChild.path">
                                <span slot="title">{{itemChild.name}}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                    <el-menu-item v-else :index="item.path" :key="item.path">
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </div>
            </el-menu>
        </el-aside>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'Sidebar',
    computed: {
        ...mapState({
            routeInfo: state=>state.user.routeInfo
        })
    },
    created() {
        this.list = this.routeInfo[0].children
        this.list = this.list.concat(this.commonRoute)
        // this.$router.push({name: '首页'})
    },
    data() {
        return {
            list: '',
            commonRoute: [{
              path: '/personal',
              name: '个人中心'
            }]
        }
    },
    methods: {
      
    }
}
</script>
<style lang="scss" scoped>
    .el-aside {
        height: 100vh;
        overflow: auto; 
        overflow-x: hidden;
        .el-menu {
            border-right-width: 0;
            height: inherit;
        }
    }
</style>