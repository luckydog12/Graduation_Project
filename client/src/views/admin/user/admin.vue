<template>
  <div class="user">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="账号: ">
          <el-autocomplete class="inline-input" v-model="searchForm.account" placeholder="请输入账号"
            :fetch-suggestions="querySearchAccount" @select="handleSelectAccount">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="姓名: ">
          <el-autocomplete class="inline-input" v-model="searchForm.nickName" placeholder="请输入姓名"
            :fetch-suggestions="querySearchNickName" @select="handleSelectNickName">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="性别: ">
          <el-select v-model="searchForm.sex" clearable placeholder="请选择性别">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份: ">
          <el-select v-model="searchForm.identity" clearable placeholder="请选择身份">
            <el-option label="管理员" value="1"></el-option>
            <el-option label="业主" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="userData" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名">
        <template slot-scope="scope">{{scope.row.name || '-'}}</template>
      </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号码">
        <template slot-scope="scope">{{scope.row.phoneNumber || '-'}}</template>
      </el-table-column>
      <el-table-column prop="sex" label="性别">
        <!-- <template slot-scope="scope">{{scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '-' }}</template> -->
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <template slot-scope="scope">{{scope.row.age || '-'}}</template>
      </el-table-column>
      <el-table-column prop="identity" label="身份">
        <!-- <template slot-scope="scope">{{scope.row.identity === 1 ? '管理员' : '业主' }}</template> -->
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template slot-scope="scope">{{scope.row.createdAt.split('T')[0]}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="用户信息" width="400px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="userFormDialog" :label-position="labelPosition" ref="userFormDialog">
        <el-row>
          <el-col :span="20">
            <el-form-item label="账号:" :label-width="formLabelWidth" prop="account"
              :rules="[{ required: true, message: '账号不能为空', trigger: 'blur' }]">
              <el-input v-model="userFormDialog.account" placeholder="请输入账号名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-show="password">
            <el-form-item label="默认密码:" :label-width="formLabelWidth" prop="houseArea">
              <el-input v-model="userFormDialog.password" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="身份:" :label-width="formLabelWidth" prop="identity"
              :rules="[{ required: true, message: '请选择身份', trigger: 'visible-change' }]">
              <el-select v-model="userFormDialog.identity" placeholder="请选择身份">
                <el-option label="管理员" value="1"></el-option>
                <el-option label="业主" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="姓名:" :label-width="formLabelWidth" prop="name">
              <el-input v-model="userFormDialog.name" placeholder="选填"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="性别:" :label-width="formLabelWidth" prop="sex">
              <el-select v-model="userFormDialog.sex" placeholder="选填">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="手机号码:" :label-width="formLabelWidth" prop="phoneNumber">
              <el-input v-model="userFormDialog.phoneNumber" placeholder="选填"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="年龄:" :label-width="formLabelWidth" prop="age">
              <el-input v-model="userFormDialog.age" placeholder="选填"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('userFormDialog')">确 定</el-button>
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
import { getUsersAll, getUserAccount, getUserName, deleteUser, register ,updateUser } from '@/service/login.js'
export default {
  data() {
    return {
      labelPosition: 'left',
      formLabelWidth: '100px',
      password: true,
      handleAddDialog: false,
      handeleLogo: 0,
      page: 1,
      limit: 10,
      total: 0,
      userId: 0,
      allNickName: [],
      allAccount: [],
      searchForm: {
        account: '',
        nickName: '',
        sex: '',
        identity: ''
      },
      userFormDialog: {
        account: '',
        password: '123456',
        identity: '',
        sex: null,
        name: '',
        phoneNumber: '',
        age: null
      },
      userData: []
    }
  },
  created() {
    this._getUsersAll( '', '', '', '', 1, 9999)
    this._getUserAccountName()
  },
  methods: {
    _getUsersAll( account, name, sex, identity, page, limit) {
      getUsersAll({ account, name, sex, identity, page, limit})
      .then(res => {
        if (res.data.code === 200) {
          const userData = res.data.user.rows
          this.userData = userData.map(item => {
            item.identity === 1 ? item.identity = '管理员' : item.identity = '业主'
            item.sex === 1 ? item.sex = '男' : item.sex === 2 ? item.sex = '女' : item.sex = '-'
            return item
          })
          this.total = res.data.user.count
        } else {
          this.$message.error('获取数据失败')
        }
      })
    },
    _getUserAccountName() {
      getUserAccount()
      .then(res => {
        if (res.data.code ===200) {
          this.allAccount = res.data.userAccount
        } else {
          this.$message.error('获取用户账号出错')
        }
      })
      getUserName()
      .then(res => {
        if (res.data.code ===200) {
          let allNickName = res.data.userName
          let obj = {}
          allNickName = allNickName.reduce((current, next) => {
            obj[next.value] ? "" : obj[next.value] = true && current.push(next)
            return current
          }, [])
          this.allNickName = allNickName
        } else {
          this.$message.error('获取用户姓名出错')
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleAddDialog = false
          if (this.handeleLogo === 1) {
            //添加操作
            register(this.userFormDialog)
            .then(res => {
              if (res.data.code === 200) {
                this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
                  this.searchForm.sex,this.searchForm.identity,this.page,this.limit)
                this._getUserAccountName()
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加失败')
              }
            })
          } else {
            //编辑操作
            updateUser({
              account: this.userFormDialog.account,
              identity: (this.userFormDialog.identity === '管理员' || this.userFormDialog.identity === '1') ? 1 : 2,
              name: this.userFormDialog.name,
              sex: this.userFormDialog.sex === '-' ? null : 
                (this.userFormDialog.sex === '男' || this.userFormDialog.sex === '1') ? 1 : 2,
              phoneNumber: this.userFormDialog.phoneNumber,
              age: this.userFormDialog.age
            }, this.userId)
            .then(res => {
              if (res.data.code === 200) {
                this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
                  this.searchForm.sex,this.searchForm.identity,this.page,this.limit)
                this._getUserAccountName()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message.error('修改失败')
              }
            })
          }
          this.userFormDialog = {
            account: '',
            password: '123456',
            identity: '',
            name: '',
            phoneNumber: '',
            age: null,
            sex: null
          }
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
      this.page = 1
      this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
        this.searchForm.sex,this.searchForm.identity,1,9999)
    },
    handleAdd() {
      this.password = true
      this.userFormDialog = {
        account: '',
        password: '123456',
        identity: '',
        sex: null,
        name: '',
        phoneNumber: '',
        age: null
      },
      this.handleAddDialog = true
      this.handeleLogo = 1
    },
    handleEdit(index, data) {
      this.handeleLogo = 2
      this.userId = data.id
      this.handleAddDialog = true
      this.password = false
      this.userFormDialog = data

    },
    handleDelete(index, data) {
      console.log(index, data)
      const id = data.id
      deleteUser({id})
      .then(res => {
        if (res.data.code === 200) {
          if (this.userData.length === 1) {
            this.page -=1
          }
          this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
            this.searchForm.sex, this.searchForm.identity,this.page,this.limit)
          this._getUserAccountName()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    sizeChange(val) {
      this.limit = val
      this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
        this.searchForm.sex,this.searchForm.identity,this.page,this.limit)
    },
    currentChange(val) {
      this.page = val
      this._getUsersAll(this.searchForm.account,this.searchForm.nickName,
        this.searchForm.sex,this.searchForm.identity,this.page,this.limit)
    },
  },
}
</script>

<style lang="scss" scoped>
 
</style>