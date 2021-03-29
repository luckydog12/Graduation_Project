<template>
  <div class="parking">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="车位名: ">
          <el-autocomplete class="inline-input" v-model="searchForm.name" placeholder="请输入车位名"
            :fetch-suggestions="querySearchParking" @select="handleSelectParking">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="searchForm.state" clearable placeholder="请选择车位状态">
            <el-option label="未卖出" value="2"></el-option>
            <el-option label="已卖出" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型: ">
          <el-select v-model="searchForm.type" clearable placeholder="请选择车位类型">
            <el-option label="地上" value="1"></el-option>
            <el-option label="地下" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleAddParking">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="parkingData" height="400" border stripe style="width: 80%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="车位名"></el-table-column>
      <el-table-column prop="state" label="车位状态"></el-table-column>
      <el-table-column prop="type" label="车位类型"></el-table-column>
      <el-table-column prop="hasUser" label="所属业主"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="车位信息" width="400px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="parkingFormDialog" :label-position="labelPosition" ref="parkingFormDialog">
        <el-row>
          <el-col :span="20">
            <el-form-item label="车位名:" :label-width="formLabelWidth" prop="name"
              :rules="[{ required: true, message: '车位名不能为空', trigger: 'blur' }]">
              <el-input v-model="parkingFormDialog.name" autocomplete="off" placeholder="请输入车位名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="车位状态:" :label-width="formLabelWidth" prop="state"
              :rules="[{ required: true, message: '请选择车位状态', trigger: 'visible-change' }]">
              <el-select v-model="parkingFormDialog.state" placeholder="请选择车位状态">
                <el-option label="未卖出" value="2"></el-option>
                <el-option label="已卖出" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="车位类型:" :label-width="formLabelWidth" prop="type"
              :rules="[{ required: true, message: '请选择车位类型', trigger: 'visible-change' }]">
              <el-select v-model="parkingFormDialog.type" placeholder="请选择车位类型">
                <el-option label="地上" value="1"></el-option>
                <el-option label="地下" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="hasUserShow">
            <el-form-item label="所属业主:" :label-width="formLabelWidth" prop="belongUser"
              :rules="[{ required: true, message: '请选择所属业主', trigger: 'change' }]">
              <el-autocomplete class="inline-input" v-model="parkingFormDialog.belongUser" placeholder="请输入业主名"
                :fetch-suggestions="querySearch" @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('parkingFormDialog')">确 定</el-button>
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
import { getUserAccount, getUsersAll } from "@/service/login"
import { getParking, addParking, deleteParking, updateParking } from '@/service/parking.js'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      handleLogo: 1,
      allOwner: [],
      usersAll: [],
      allParking: [],
      handleAddDialog: false,
      hasUserShow: false,
      formLabelWidth: '110px',
      labelPosition: 'left',
      searchForm: {
        name: '',
        state: '',
        type: ''
      },
      parkingData: [],
      parkingFormDialog: {
       name: '',
       type: '',
       state: '',
       belongUser: ''
      },
    }
  },
  created() {
    this._getParking('', '', '', 1, 9999)
    getUserAccount()
    .then(res => {
        if (res.data.code ===200) {
          this.allOwner = res.data.userAccount
        } else {
          this.$message.error('获取用户账号出错')
        }
      })
    getUsersAll({limit: 9999})
    .then(res => {
      if (res.data.code === 200) {
        this.usersAll = res.data.user.rows
      } else {
        this.$message.error('获取用户信息错误')
      }
    })
  },
  //监听对象 watch需要配合computed
  computed: {
    parkingState() {
      return this.parkingFormDialog.state
    }
  },
  watch: {
    parkingState(val) {
      val === '1' ? this.hasUserShow = true : this.hasUserShow = false
    }
  },
  methods: {
    _getParking(name, state, type, page, limit) {
      getParking({ name, state, type, page, limit })
      .then(res => {
        if (res.data.code === 200) {
          const parkingData = res.data.parking.rows
          this.parkingData = parkingData.map(item => {
            if (item.state === 1) {
              item.state = '已卖出'
              item.hasUser = item['User.account']
            } else {
              item.state = '未卖出'
              item.hasUser = '-'
            }
            item.type === 1 ? item.type = '地上' : item.type = '地下'
            return item
          })
          this.total = res.data.parking.count
        } else {
          this.$message.error('获取数据出错')
        }
      })
    },
    querySearchParking(queryString, cb) {
      getParking({name: '', state: '', type: '', page: 1, limit: 9999})
      .then(res => {
        if (res.data.code === 200) {
          this.allParking = []
          let parkingData = res.data.parking.rows
          parkingData.map(item => {
            this.allParking.push({value: item.name})
          })
          let allParking = this.allParking
          let results = queryString ? allParking.filter(this.createFilterParking(queryString)) : allParking
          // 调用 callback 返回建议列表的数据
          cb(results)
        } else {
          this.$message.error('获取车位名出错')
        }
      })
    },
    createFilterParking(queryString) {
      return (parking) => {
        return (parking.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    handleSelectParking(item) {
      console.log(item)
    },
    handleSearch() {
      this.page = 1
      this._getParking(this.searchForm.name, this.searchForm.state, 
        this.searchForm.type, this.page, this.limit)
    },
    handleAddParking() {
      this.handleAddDialog = true
      this.handleLogo = 2
      this.parkingFormDialog = {
       name: '',
       type: '',
       state: '',
       belongUser: ''
      }
    },
    confirm(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          let id = this.usersAll.map(item => {
            if (item.account == this.parkingFormDialog.belongUser)
            return item.id
          })
          id = id.filter(item => item)
          this.parkingFormDialog.belongUser = id[0]
          if (this.handleLogo === 1) {
            //编辑操作
            const parkingId = this.parkingFormDialog.id
            updateParking({
              name: this.parkingFormDialog.name,
              state: this.parkingFormDialog.state,
              type: this.parkingFormDialog.type,
              belongUser: this.parkingFormDialog.state == '1' ? this.parkingFormDialog.belongUser : null
            }, parkingId)
            .then(res => {
              if (res.data.code === 200) {
                this._getParking(this.searchForm.name, this.searchForm.state, 
                  this.searchForm.type, this.page, this.limit)
                this.$message({
                  message: '车位信息更新成功',
                  type: 'success'
                })
              } else {
                this.$message.error('车位信息更新失败')
              }
            })
          } else {
            //添加操作
            addParking(this.parkingFormDialog)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  message: '车位信息添加成功',
                  type: 'success'
                })
                this._getParking(this.searchForm.name, this.searchForm.state, 
                  this.searchForm.type, this.page, this.limit)
              } else {
                this.$message.error('车位信息添加出错')
              }
            })
          }
          this.handleAddDialog = false
          this.parkingFormDialog = {
            name: '',
            state: '',
            type: '',
            belongUser: ''
          }
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      this.handleLogo = 1
      this.handleAddDialog = true
      Object.assign(this.parkingFormDialog, data)
      this.parkingFormDialog.state === '未卖出' ? this.parkingFormDialog.state = '2' : this.parkingFormDialog.state = '1'
      this.parkingFormDialog.type === '地下' ? this.parkingFormDialog.type = '2' : this.parkingFormDialog.type = '1' 
      this.parkingFormDialog.belongUser = this.parkingFormDialog['User.account']
    },
    handleDelete(index, data) {
      const id = data.id
      deleteParking({id})
      .then(res => {
        if (res.data.code === 200) {
          if (this.parkingData.length === 1 && this.page !== 1) {
            this.page -=1
          }
          this._getParking(this.searchForm.name, this.searchForm.state, 
                  this.searchForm.type, this.page, this.limit)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    querySearch(queryString, cb) {
      let allOwner = this.allOwner
      let results = queryString ? allOwner.filter(this.createFilter(queryString)) : allOwner
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (owner) => {
        return (owner.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    sizeChange(val) {
      this.limit = val
      this._getParking(this.searchForm.name, this.searchForm.state, 
        this.searchForm.type, this.page, this.limit)
    },
    currentChange(val) {
      this.page = val
      this._getParking(this.searchForm.name, this.searchForm.state, 
        this.searchForm.type, this.page, this.limit)
    }
  },
}
</script>

<style lang="scss" scoped>
  
</style>