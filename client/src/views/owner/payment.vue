<template>
  <div>
    <el-table :data="payForm" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="payType" label="缴费类型"></el-table-column>
      <el-table-column prop="payValue" label="缴费值"></el-table-column>
      <el-table-column prop="dead_at" label="截止日期"></el-table-column>
      <el-table-column prop="payState" label="缴费状态"></el-table-column>
      <el-table-column prop="updated_at" label="缴费日期">
        <template slot-scope="scope">
          {{scope.row.updated_at || '-'}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handlePay(scope.$index, scope.row)">支付</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payForm: [{
        payType: '水电费',
        payValue: 100,
        dead_at: '2021-3-1',
        payState: '已缴交',
        updated_at: '2021-2-28'
      }]
    }
  },
  methods: {
    handlePay(index, item) {
      console.log(index, item)
      
    }
  },
}
</script>

<style lang="scss" scoped>
  
</style>