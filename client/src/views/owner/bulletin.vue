<template>
  <div>
    <el-table :data="bulletin" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="公告标题"></el-table-column>
      <el-table-column prop="content" label="公告内容"></el-table-column>
      <el-table-column prop="publishAt" label="发布时间"></el-table-column>
    </el-table>      
  </div>
</template>

<script>
import { getBulletin } from '@/service/bulletin'
export default {
  data() {
    return {
      bulletin: []  
    }
  },
  created() {
    getBulletin({state: 1,limit: 9999})
    .then(res => {
      if (res.data.code === 200) {
        const bulletin = res.data.bulletin.rows
        this.bulletin = bulletin.map(item => {
          let date = new Date(Date.parse(item.publishAt))
          item.publishAt = date.toLocaleDateString()
          return item
        })
      } else {
        this.$message.error('获取出错')
      }
    })
  },
}
</script>

<style lang="scss" scoped>
  
</style>