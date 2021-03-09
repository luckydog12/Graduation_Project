<template>
    <div>
      <el-container class="container" style="height: 100vh;">
        <Sidebar />
        <el-container class="appMain">
          <Header></Header>
          <el-main>
            <!-- key解决别名问题，本系统管理员界面维修与投诉共用一份代码，key不同，vue会认为这是俩个不同的页面 -->
            <router-view :key="$route.fullPath"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>

<script>
import Header from './components/header'
import Sidebar from './components/sidebar'
export default {
  components: {
    Header,
    Sidebar
  },
  created() {
    
  },
  data() {
      return {

      }
  },
  
}
</script>

<style lang="scss">
  *{
    margin: 0;
  }
  .container {
    margin: 0 10px;
  }
  .appMain {
    display: flex;
    flex-direction: column;
  }
</style>