<template>
  <div class="house">
    <div class="search">
      <el-select v-model="searchHouse" placeholder="请选择房屋状态" class="state" clearable>
        <el-option label="未卖出" value="2"></el-option>
        <el-option label="已卖出" value="1"></el-option>
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="primary" @click="handleAddHouse">添加</el-button>
    </div>
    <el-table :data="houseData" height="400" border stripe style="width: 80%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="房屋名"></el-table-column>
      <el-table-column prop="area" label="房屋面积"></el-table-column>
      <el-table-column prop="state" label="房屋状态">
        <!-- <template slot-scope="scope">
          {{scope.row.state === 1 ? "已卖出" : "未卖出"}}
        </template> -->
      </el-table-column>
      <el-table-column prop="belongBuilding" label="隶属楼栋单元"></el-table-column>
      <el-table-column prop="hasUser" label="所属业主">
        <!-- <template slot-scope="scope">
          {{scope.row.state === 1 ? scope.row['User.account'] : '-'}}
        </template> -->
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="房屋信息" width="400px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="houseFormDialog" :label-position="labelPosition" ref="houseFormDialog">
        <el-row>
          <el-col :span="20">
            <el-form-item label="房屋名:" :label-width="formLabelWidth" prop="name"
              :rules="[{ required: true, message: '房屋名不能为空', trigger: 'blur' }]">
              <el-input v-model="houseFormDialog.name" autocomplete="off" placeholder="请输入房屋名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="房屋面积:" :label-width="formLabelWidth" prop="area"
              :rules="[{ required: true, message: '房屋面积不能为空', trigger: 'blur' },
                       { type: 'number', message: '面积必须为数字值', trigger: 'blur' }]">
              <el-input v-model.number="houseFormDialog.area" autocomplete="off" placeholder="请输入房屋面积">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="房屋状态:" :label-width="formLabelWidth" prop="state"
              :rules="[{ required: true, message: '请选择房屋状态', trigger: 'visible-change' }]">
              <el-select v-model="houseFormDialog.state" placeholder="请选择房屋状态">
                <el-option label="未卖出" value="2"></el-option>
                <el-option label="已卖出" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="隶属楼栋单元:" :label-width="formLabelWidth" prop="belongBuilding"
              :rules="[{ required: true, message: '请选择隶属楼栋单元', trigger: 'visible-change' }]">
              <el-cascader placeholder="请选择隶属房屋" :options="optionsHouse" filterable clearable 
                v-model="houseFormDialog.belongBuilding">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="hasUserShow">
            <el-form-item label="所属业主:" :label-width="formLabelWidth" prop="belongUser"
              :rules="[{ required: true, message: '请选择所属业主', trigger: 'change' }]">
              <el-autocomplete class="inline-input" v-model="houseFormDialog.belongUser" placeholder="请输入业主名"
                :fetch-suggestions="querySearch" @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('houseFormDialog')">确 定</el-button>
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
import { getBuilding } from "@/service/building"
import { getUserAccount, getUsersAll } from "@/service/login"
import { deleteHouse, addHouse, getHouse, updateHouse } from "@/service/house"
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      handleLogo: 1,
      searchHouse: '',
      owner: '',
      allOwner: [],
      handleAddDialog: false,
      hasUserShow: false,
      formLabelWidth: '110px',
      labelPosition: 'left',
      houseData: [],
      houseFormDialog: {
       name: '',
       area: '',
       state: '',
       belongBuilding: '',
       belongUser: null
      },
      optionsHouse: [],
      usersAll: []
    }
  },
  created() {
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
    getBuilding({name: '', page: 1, limit: 9999})
    .then(res => {
      if(res.status === 201) {
        const buildingAll = res.data.building.rows
        let tempOptionsHouse = []
        for (let i = 0; i<buildingAll.length; i++) {
          tempOptionsHouse[i] = {value: buildingAll[i].name, label: buildingAll[i].name}
        }
        let units = buildingAll.map(item => {
          return item.units
        })
        units = units.map(item => {
          return item.split(',')
        })
        for (let i = 0; i<units.length; i++) {
          for (let j = 0; j<units[i].length; j++) {
            units[i][j] = { value: units[i][j], label: units[i][j] }
          }
        }
        for (let i = 0; i<tempOptionsHouse.length; i++) {
          tempOptionsHouse[i].children = units[i]
        }
        this.optionsHouse = tempOptionsHouse
      } else {
        this.$message.error('数据查询失败')
      }
    })
    this._getHouse('', 1, 9999)
  },
  //监听对象 watch需要配合computed
  computed: {
    houseState() {
      return this.houseFormDialog.state
    }
  },
  watch: {
    houseState(val) {
      val === '1' ? this.hasUserShow = true : this.hasUserShow = false
    }
  },
  methods: {
    _getHouse(state, page, limit) {
      getHouse({state, page, limit})
      .then(res => {
        if (res.data.code === 200) {
          const houseData = res.data.house.rows
          this.houseData = houseData.map(item => {
            if (item.state === 1) {
              item.state = '已卖出'
              item.hasUser = item['User.account']
            } else {
              item.state = '未卖出'
              item.hasUser = '-'
            }
            return item
          })
          this.total = res.data.house.count
        } else {
          this.$message.error('~获取数据出错')
        }
      })
    },
    handleSearch() {
      this.page = 1
      this._getHouse(this.searchHouse, this.page, this.limit)
    },
    handleAddHouse() {
      this.hasUserShow = false
      this.houseFormDialog = {
       name: '',
       area: '',
       state: '',
       belongBuilding: '',
       belongUser: null
      },
      this.handleAddDialog = true
      this.handleLogo = 2
    },
    confirm(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          this.houseFormDialog.belongBuilding =`${this.houseFormDialog.belongBuilding[0]} / ${this.houseFormDialog.belongBuilding[1]}`
          this.houseFormDialog.area = `${this.houseFormDialog.area}㎡`
          let id = this.usersAll.map(item => {
            if (item.account == this.houseFormDialog.belongUser)
            return item.id
          })
          id = id.filter(item => item)
          if (this.handleLogo === 1) {
            //编辑操作
            const houseId = this.houseFormDialog.id
            this.houseFormDialog.belongUser = id[0]
            updateHouse({
              name: this.houseFormDialog.name,
              area: this.houseFormDialog.area,
              belongBuilding: this.houseFormDialog.belongBuilding,
              state: this.houseFormDialog.state,
              belongUser: this.houseFormDialog.state == '1' ? this.houseFormDialog.belongUser : null
            }, houseId)
            .then(res => {
              if (res.data.code === 200) {
                this._getHouse(this.searchHouse, this.page, this.limit)
                this.$message({
                  message: '房屋信息修改成功',
                  type: 'success'
                }) 
              } else {
                this.$message.error('房屋信息修改失败，请重试')
              }
            })
          } else {
            this.houseFormDialog.belongUser = id[0]
            addHouse(this.houseFormDialog)
            .then(res => {
              if (res.data.code === 200) {
                this._getHouse(this.searchHouse, this.page, this.limit)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加失败，请重试')
              }
            })
          }
          this.handleAddDialog = false
          this.houseFormDialog = {
            name: '',
            area: '',
            state: '',
            belongBuilding: '',
            belongUser: null
          }
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      this.handleLogo = 1
      this.handleAddDialog = true
      Object.assign(this.houseFormDialog, data)
      this.houseFormDialog.state === '已卖出' ? this.houseFormDialog.state = '1' : this.houseFormDialog.state = '2'
      this.houseFormDialog.belongBuilding = this.handleCascader(data.belongBuilding)
      this.houseFormDialog.area = this.handleHouseArea(data.area)
      this.houseFormDialog.belongUser = this.houseFormDialog['User.account']
    },
    handleDelete(index, data) {
      const id = data.id
      deleteHouse({id})
      .then(res => {
        if (res.data.code === 200) {
          if (this.houseData.length === 1) {
            this.page -=1
          }
          this._getHouse(this.searchHouse, this.page, this.limit)
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
      this._getHouse(this.searchHouse, this.page, this.limit)
    },
    currentChange(val) {
      this.page = val 
      this._getHouse(this.searchHouse, this.page, this.limit)
    },
    // A栋 / A1 => ['A栋', 'A1']
    handleCascader(item) {
      let arr = item.split('/')
      arr = arr.map( val => {
        return val.trim()
      })
      return arr
    },
    handleHouseArea(item) {
      let length = item.length
      item = item.slice(-length, -1)
      return parseInt(item)
    }
  },
}
</script>

<style lang="scss" scoped>
  .house {
    .search {
      margin-bottom: 10px;
      display: flex;
      .state {
        margin-right: 10px;
      }
    }
  }
</style>