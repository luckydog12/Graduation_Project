<template>
  <div>
    <el-table :data="payForm" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="payType" label="缴费类型"></el-table-column>
      <el-table-column prop="payValue" label="缴费值"></el-table-column>
      <el-table-column prop="dead_at" label="截止日期"></el-table-column>
      <el-table-column prop="state" label="缴费状态"></el-table-column>
      <el-table-column prop="pay_date" label="缴费日期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handlePay(scope.$index, scope.row)">支付</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="qrcode" ref="qrCodeUrl"></div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { getPayManage } from '@/service/payManage'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      payForm: []
    }
  },
  computed: {
    ...mapState({
      userId: state=>state.user.id
    })
  },
  created() {
    getPayManage({belongUser: this.userId, limit: 9999})
    .then(res => {
      console.log(res.data.payManage.rows)
      if (res.data.code === 200) {
        let payManage = res.data.payManage.rows
        this.payForm = payManage.map(item => {
          item.payType = item['PayType.name']
          item.payValue = `${item.value}元`
          item.dead_at = (item.deadLine).split('T')[0]
          if (item.state === 1) {
            item.state = '已缴费'
          } else {
            item.state = '未缴费'
            item.pay_date = '-'
          }
          return item
        })
      } else {
        this.$message.error('获取出错')
      }
    })
  },
  methods: {
    handlePay(index, item) {
      console.log(index, item)
      
    },
    creatQrCode() {
      return  new QRCode(this.$refs.qrCodeUrl, {
        text: 'https://luckydog314.ltd/', // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H //容错等级
      })
    },
  },
  mounted() {
    this.creatQrCode()
  },
}
</script>

<style lang="scss" scoped>
  
</style>