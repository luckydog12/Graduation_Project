<template>
  <div class="payManage">
    <div class="search">
      <el-form :model="searchForm" class="demo-form-inline" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>缴费类型记录</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="addPayType">添加</el-button>
              </div>
              <div class="flex">
                <el-table :data="payTypeData" height="200" border stripe style="width: 90%">
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column prop="name" label="缴费类型"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="60">
                    <template slot-scope="scope">   
                      <el-button type="text" @click="handleEditPayType(scope.$index, scope.row)">修改</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card> 
          </el-col>
          <el-col :span="10">
            <el-form-item label="缴费类型: ">
              <!-- <el-autocomplete class="inline-input" v-model="searchForm.payType" placeholder="请输入缴费类型"
                :fetch-suggestions="querySearchPayType" @select="handleSelectPayType">
              </el-autocomplete> -->
              <el-select v-model="searchForm.payType" clearable placeholder="请选择缴费类型">
                <el-option v-for="item in payTypeData" :key="item.name" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账号: ">
              <el-autocomplete class="inline-input" v-model="searchForm.account" placeholder="请输入账号"
                :fetch-suggestions="querySearchAccount" @select="handleSelectAccount">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="缴费状态: ">
              <el-select v-model="searchForm.payState" clearable placeholder="请选择缴费状态">
                <el-option label="未缴交" value="2"></el-option>
                <el-option label="已缴交" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="截止日期: ">
              <el-date-picker v-model="searchForm.dead_at" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button type="primary" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row> 
      </el-form>
    </div>
    <el-table :data="payForm" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="belongType" label="缴费类型"></el-table-column>
      <el-table-column prop="belongUser" label="账号"></el-table-column>
      <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
      <el-table-column prop="value" label="缴费值"></el-table-column>
      <el-table-column prop="deadLine" label="截止日期"></el-table-column>
      <el-table-column prop="state" label="缴费状态"></el-table-column>
      <el-table-column prop="payDate" label="缴费日期">
        <!-- <template slot-scope="scope">
          {{scope.row.updated_at || '-'}}
        </template> -->
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- manage dialog -->
    <el-dialog title="缴费信息" width="400px" 
      :close-on-click-modal="false" :visible.sync="handlePayManageDialog">
      <el-form :model="payManageDialog" label-position="left" ref="payManageDialog" label-width="90px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="缴费类型: " prop="type"
              :rules="[{ required: true, message: '缴费类型不能为空', trigger: 'visible-change' }]">
              <el-select v-model="payManageDialog.type" clearable placeholder="请选择缴费类型">
                <el-option v-for="item in payTypeData" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="账号: " prop="account"
              :rules="[{ required: true, message: '账号不能为空', trigger: 'change' }]">
              <el-autocomplete class="inline-input" v-model="payManageDialog.account" placeholder="请选择账号"
                :fetch-suggestions="querySearchAccount" @select="handleSelectAccount">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="缴费值: " prop="value"
              :rules="[{ required: true, message: '缴费值不能为空', trigger: 'blur' },
                       { type: 'number', message: '缴费值必须为数字且最小值为10', trigger: 'blur', min: 10 }]">
              <el-input v-model.number="payManageDialog.value" autocomplete="off" type="number" min="10" placeholder="请输入缴费值">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="截止日期: " prop="deadLine"
              :rules="[{ required: true, message: '截止日期不能为空', trigger: 'blur' }]">
              <el-date-picker v-model="payManageDialog.deadLine" type="date" 
                placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlePayManageDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('payManageDialog')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- type dialog -->
    <el-dialog title="缴费类型" width="500px" 
      :close-on-click-modal="false" :visible.sync="handlePayTypeDialog">
      <el-form :model="payTypeDialog" label-position="left" ref="payTypeDialog" label-width="90px">
        <el-form-item label="名称: " prop="name" :rules="[{ required: true, message: '不能为空', trigger: 'blur' }]">
          <el-input v-model="payTypeDialog.name"  placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlePayTypeDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmPayType('payTypeDialog')">确 定</el-button>
      </div>
    </el-dialog>
    <pagination
      :currentPage="page"
      :pageSize="limit"
      :total="total"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
    </pagination>
  </div>
</template>

<script>
import { addPayType, getPayType, updatePayType } from '@/service/payType'
import { getPayManage, addPayManage, updatePayManage, deletePayManage } from '@/service/payManage'
import { getUsersAll } from '@/service/login'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      handleLogo: 1,
      handlePayManageDialog: false,
      handlePayTypeDialog: false,
      allAccount: [],
      searchForm: {
        payType: '',
        account: '',
        payState: '',
        dead_at: ''
      },
      pickerOptions: {
        disabledDate(time) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return time.getTime() < date
        },
      },
      payTypeData: [],
      payForm: [],
      payManageDialog: {
        type: '',
        account: '',
        value: '',
        deadLine: ''
      },
      payTypeDialog: {
        name: ''
      }
    }
  },
  created() {
    this._getPayType()
    this._getPayManage('', '', '', '', 1, 9999)
    this._getUsersAll(9999)
  },
  methods: {
    _getPayType() {
      getPayType().
      then(res => {
        if (res.data.code === 200) {
          this.payTypeData = res.data.payType
          console.log('888', this.payTypeData)
        } else {
          this.$message.error('获取缴费类型出错')
        }
      })
    },
    _getUsersAll(limit) {
      getUsersAll({limit}).
      then(res => {
        if (res.data.code === 200) {
          this.allAccount = []
          const allAccount = res.data.user.rows
          allAccount.map(item => {
            this.allAccount.push({value: item.account, id: item.id})
          })
        } else {
          this.$message.error('获取用户账号出错')
        }
      })
    },
    _getPayManage(belongType, belongUser, state, deadLine, page, limit) {
      getPayManage({belongType, belongUser, state, deadLine, page, limit})
      .then(res => {
        if (res.data.code === 200) {
          const payForm = res.data.payManage.rows
          this.total = res.data.payManage.count
          this.payForm = payForm.map(item => {
            item.belongType = item['PayType.name']
            item.belongUser = item['User.account']
            item.phoneNumber = item['User.phoneNumber'] || '-'
            item.value = `${item.value}元`
            item.deadLine = item.deadLine.split('T')[0]
            if (item.state === 1) {
              item.state = '已缴费'
              let date = item.payDate
              date = new Date(Date.parse(date))
              item.payDate = date.toLocaleDateString()
            } else {
              item.state = '未缴费'
              item.payDate = '-'
            }
            return item
          })
        } else {
          this.$message.error('获取缴费信息失败')
        }
      })
    },
    addPayType() {
      this.handleLogo = 2 
      this.handlePayTypeDialog = true
      this.payTypeDialog = {
        name: ''
      }
    },
    handleEditPayType(index, data) {
      console.log(index, data)
      this.handleLogo = 1
      this.handlePayTypeDialog = true
      this.payTypeDialog.name = data.name
      this.payTypeDialog.id = data.id
    },
    confirmPayType(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.handleLogo === 2) {
            //添加操作
            addPayType(this.payTypeDialog)
            .then(res => {
              if (res.data.code === 200) {
                this._getPayType()
                this.$message({
                  message: '缴费类型添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error(`${res.data.error}`)
              }
            })
          } else {
            //修改操作
            updatePayType({
              name: this.payTypeDialog.name
            }, this.payTypeDialog.id)
            .then(res => {
              if (res.data.code === 200) {
                this._getPayType()
                this.$message({
                  message: '缴费类型修改成功',
                  type: 'success'
                }) 
              } else {
                this.$message.error('缴费类型修改失败')
              }
            })
          }
          this.handlePayTypeDialog = false
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    querySearchAccount(queryString, cb) {
      let allAccount = this.allAccount
      let results = queryString ? allAccount.filter(this.createFilter(queryString)) : allAccount
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelectAccount(item) {
      console.log(item)
    },
    afterHandleGetPayManage() {
      this.searchForm.id = null
      const date = this.searchForm.dead_at
      if (date) {
       date.setTime(date.getTime() + 3600 * 1000 * 8) 
      }
      this.allAccount.map(item => {
        if (this.searchForm.account === item.value) {
          this.searchForm.id = item.id
        }
      })
      this._getPayManage(this.searchForm.payType, this.searchForm.id, 
        this.searchForm.payState, date, this.page, this.limit)
    },
    handleSearch() {
      this.page = 1
      this.searchForm.id = null
      const date = this.searchForm.dead_at
      if (date) {
       date.setTime(date.getTime() + 3600 * 1000 * 8) 
      }
      this.allAccount.map(item => {
        if (this.searchForm.account === item.value) {
          this.searchForm.id = item.id
        }
      })
      this._getPayManage(this.searchForm.payType, this.searchForm.id, 
        this.searchForm.payState, date, this.page, this.limit)
    },
    handleAdd() {
      this.handleLogo = 2
      this.handlePayManageDialog = true
      // this.$refs[formName].resetFields()
      // this.payManageDialog = {
      //   type: '',
      //   account: '',
      //   value: '',
      //   deadLine: ''
      // }
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.payManageDialog)
          this.payTypeData.map(item => {
            if (this.payManageDialog.type === item.name) {
              this.payManageDialog.belongType = item.id
            }
          })
          this.allAccount.map(item => {
            if (this.payManageDialog.account === item.value) {
              this.payManageDialog.belongUser = item.id
            }
          })
          if (this.handleLogo === 1) {
            //修改操作
            updatePayManage({
              belongType: this.payManageDialog.belongType,
              belongUser: this.payManageDialog.belongUser,
              deadLine: this.payManageDialog.deadLine,
              value: this.payManageDialog.value
            }, this.payManageDialog.id)
            .then(res => {
              if (res.data.code === 200) {
                this._getPayManage(this.searchForm.payType, this.searchForm.account, 
                  this.searchForm.payState, this.searchForm.dead_at, this.page, this.limit)
                this.$message({
                  message: '修改缴费信息成功',
                  type: 'success'
                })
              } else {
                this.$message.error('修改缴费信息失败')
              }
            })
          } else {
            //添加操作
            addPayManage(this.payManageDialog)
            .then(res => {
              if (res.data.code === 200) {
                this._getPayManage(this.searchForm.payType, this.searchForm.account, 
                  this.searchForm.payState, this.searchForm.dead_at, this.page, this.limit)
                this.$message({
                  message: '添加缴费信息成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加缴费信息失败')
              }
            })

          }
          this.handlePayManageDialog = false
          this.$refs[formName].resetFields()
          // this.payManageDialog = {
          //   type: '',
          //   account: '',
          //   value: '',
          //   deadLine: ''
          // }
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      this.handleLogo = 1
      this.handlePayManageDialog = true
      this.payManageDialog.type = data.belongType
      this.payManageDialog.account = data.belongUser
      this.payManageDialog.value = parseFloat(data.value.split('元')[0])
      this.payManageDialog.deadLine = data.deadLine
      this.payManageDialog.belongType = data.belong_type
      this.payManageDialog.belongUser = data.belong_user
      this.payManageDialog.id = data.id
    },
    handleDelete(index, data) {
      const id = data.id
      deletePayManage({id})
      .then(res => {
        if (res.data.code === 200) {
          if (this.payForm.length === 1 && this.page !== 1) {
            this.page -=1
          }
          this._getPayManage(this.searchForm.payType, this.searchForm.account, 
            this.searchForm.payState, this.searchForm.dead_at, this.page, this.limit)
          this.$message({
            message: '删除缴费信息成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除缴费信息失败')
        }
      })
    },
    sizeChange(val) {
      this.limit = val
      this.afterHandleGetPayManage()
    },
    currentChange(val) {
      this.page = val
      this.afterHandleGetPayManage()
    },
  },
}
</script>

<style lang="scss" scoped>
  .payManage {
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
  }
</style>