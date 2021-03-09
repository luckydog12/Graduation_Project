<template>
  <div class="payManage">
    <div class="search">
      <el-form :model="searchForm" class="demo-form-inline" label-width="80px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>缴费类型</span>
              </div>
              <div class="flex">
                <div v-for="item in payTypeCard" :key="item" class="text item">
                  {{ item }}
                </div>
              </div>
            </el-card> 
          </el-col>
          <el-col :span="10">
            <el-form-item label="缴费类型: ">
              <el-autocomplete class="inline-input" v-model="searchForm.payType" placeholder="请输入缴费类型"
                :fetch-suggestions="querySearchPayType" @select="handleSelectPayType">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名: ">
              <el-autocomplete class="inline-input" v-model="searchForm.nickName" placeholder="请输入姓名"
                :fetch-suggestions="querySearchNickName" @select="handleSelectNickName">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="缴费状态: ">
              <el-select v-model="searchForm.payState" clearable placeholder="请选择缴费状态">
                <el-option label="未缴交" value="wei"></el-option>
                <el-option label="已缴交" value="yi"></el-option>
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
      <el-table-column prop="payType" label="缴费类型"></el-table-column>
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
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
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="缴费信息" width="500px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="payManageDialog" label-position="left" ref="payManageDialog" label-width="90px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="缴费类型: " prop="payType"
              :rules="[{ required: true, message: '缴费类型不能为空', trigger: 'change' }]">
              <el-select v-model="payManageDialog.payType" clearable placeholder="请选择缴费类型">
                <el-option v-for="item in payTypeCard" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="姓名: " prop="nickName"
              :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]">
              <el-input v-model="payManageDialog.nickName" autocomplete="off" placeholder="请输入姓名">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="电话号码: " prop="phoneNumber"
              :rules="[{ required: true, message: '电话号码不能为空', trigger: 'blur' },
                       { type: 'number', message: '号码必须为数字值', trigger: 'blur' }]">
              <el-input v-model.number="payManageDialog.phoneNumber" autocomplete="off" placeholder="请输入电话号码">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="缴费值: " prop="payValue"
              :rules="[{ required: true, message: '缴费值不能为空', trigger: 'blur' },
                       { type: 'number', message: '缴费值必须为数字', trigger: 'blur' }]">
              <el-input v-model.number="payManageDialog.payValue" autocomplete="off" placeholder="请输入缴费值">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="截止日期: " prop="dead_at"
              :rules="[{ required: true, message: '截止日期不能为空', trigger: 'blur' }]">
              <el-date-picker v-model="payManageDialog.dead_at" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('payManageDialog')">确 定</el-button>
      </div>
    </el-dialog>
    <pagination
      :currentPage="1"
      :pageSize="2"
      :total="40"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
    </pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      handleLogo: 1,
      handleAddDialog: false,
      payTypeCard: ['水电费', '物业费', '煤气费', '停车费'],
      allNickName: [ {value: '张三'}, {value: '李四'} ],
      allPayType: [ {value: '水电费'}, {value: '停车费'} ],
      searchForm: {
        payType: '',
        nickName: '',
        payState: '',
        dead_at: ''
      },
      payForm: [{
        payType: '水电费',
        nickName: '张三',
        phoneNumber: '123456',
        payValue: 100,
        dead_at: '2021-3-1',
        payState: '未缴交',
        updated_at: ''
      }, {
        payType: '水电费',
        nickName: '李四',
        phoneNumber: '123456',
        payValue: 100,
        dead_at: '2021-3-1',
        payState: '已缴交',
        updated_at: '2021-2-28'
      }],
      payManageDialog: {
        payType: '',
        nickName: '',
        phoneNumber: '',
        payValue: '',
        dead_at: ''
      }
    }
  },
  methods: {
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    querySearchPayType(queryString, cb) {
      let allPayType = this.allPayType
      let results = queryString ? allPayType.filter(this.createFilter(queryString)) : allPayType
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelectPayType(item) {
      console.log(item)
    },
    querySearchNickName(queryString, cb) {
      let allNickName = this.allNickName
      let results = queryString ? allNickName.filter(this.createFilter(queryString)) : allNickName
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelectNickName(item) {
      console.log(item)
    },
    handleSearch() {

    },
    handleAdd() {
      this.handleLogo = 2
      this.handleAddDialog = true
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.handleLogo === 1) {
            //修改操作
          } else {
            //添加操作
          }
          this.handleAddDialog = false
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      console.log(index, data)
      this.handleLogo = 1
      this.handleAddDialog = true
    },
    handleDelete(index, data) {
      console.log(index, data)
    },
    sizeChange(val) {
      console.log('dad',val)
    },
    currentChange(val) {
      console.log('dad', val)
    },
  },
}
</script>

<style lang="scss" scoped>
  .payManage {
    .flex {
      display: flex;
    }
    .item {
      font-size: 14px;
      margin: 25px 5px
    }
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