<template>
  <div>
    <el-table :data="bulletin" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="公告标题"></el-table-column>
      <el-table-column prop="content" label="公告内容"></el-table-column>
      <el-table-column prop="published_at" label="发布时间"></el-table-column>
    </el-table>      
  </div>
</template>

<script>
export default {
  data() {
    return {
      bulletin: [{
        title: '公告1',
        content: '测试',
        published_at: '2021-2-26'
      }]  
    }
  },
}
</script>

<style lang="scss" scoped>
  
</style>