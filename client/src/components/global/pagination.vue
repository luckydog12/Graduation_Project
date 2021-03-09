<template>
  <div>
    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    currentPage: { //当前页
      type: Number,
      required: true
    },
    pageSize: { //每页显示条数
      type: Number,
      required: true
    },
    total: { 
      type: Number,
      required: true
    }
  },
  methods: {
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.$emit('sizeChange', val)
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.$emit('currentChange', val)
      }
  },
}
</script>

<style lang="scss">
  .el-pagination {
    margin-top: 10px;
  }
</style>