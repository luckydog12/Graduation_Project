<template>
    <el-header style="text-align: right; font-size: 12px">
        <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span>王小虎</span>
    </el-header>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'Header',
    methods: {
        ...mapActions([
            'setUser',
            'setToken'
        ]),
        //退出原理： 清空vuex中state信息
        logout() {
            this.setUser(null)
            this.setToken('')
            this.$router.push({name: 'Login'})
        },
        handleCommand(routeName) {
            if(routeName === 'logout') {
                this.logout()
            } else {
                this.$router.push({name: routeName})
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
</style>