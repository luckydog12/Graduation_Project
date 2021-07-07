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
          <el-button type="text" :disabled="scope.row.state=='已缴费'" @click="handlePay(scope.$index, scope.row)">支付</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPayManage, updatePayManage } from '@/service/payManage'
import { alipay, payStatus } from '@/service/alipay'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      payForm: []
    }
  },
  computed: {
    ...mapState({
      userId: state=>state.user.id,
      outTradeNo: state=>state.outTradeNo,
      payId: state=>state.payId
    })
  },
  created() {
    if (this.outTradeNo && this.payId) {
      payStatus({outTradeNo: this.outTradeNo})
      .then(res => {
        console.log('paystatus', res)
        if (res.data.code === 200 && res.data.result.status === 2) {
          this.$message.success("交易支付成功")
          updatePayManage({
            state: 1,
            payDate: (new Date()).toLocaleDateString()
          }, this.payId)
          .then(res => {
            if (res.data.code === 200) {
              this.setPayId(null)
              this.setOutTradeNo(null)
              this._getPayManage()
            }
          })
        }
      })
    }
    this._getPayManage()
  },
  methods: {
    ...mapActions([
        'setPayId',
        'setOutTradeNo'
      ]),
    _getPayManage() {
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
            let date = item.payDate
            date = new Date(Date.parse(date))
            item.pay_date = date.toLocaleDateString()
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
    orderCode() {
      let orderCode = ''
      for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
      {
        orderCode += Math.floor(Math.random() * 10)
      }
      orderCode = new Date().getTime() + orderCode  //时间戳，用来生成订单号。
      console.log(orderCode)
      return orderCode
    },
    handlePay(index, item) {
      console.log(index, item)
      const outTradeNo = this.orderCode()
      const payId = item.id
      this.$store.dispatch('setOutTradeNo', outTradeNo)
      this.$store.dispatch('setPayId', payId)
      alipay({
        outTradeNo,
        totalAmount: item.value,
        subject: item.payType
      }).then(res => {
        if(res.data.status === 200) {
          window.location.href = res.data.result
        } else {
          this.$message.error("支付出错，请重试")
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  
</style>