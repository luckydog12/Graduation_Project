<template>
  <div class="building">
    <div class="search">
      <el-autocomplete class="inline-input" v-model="searchBuilding" placeholder="请输入楼栋名"
        :fetch-suggestions="querySearch" @select="handleSelect">
      </el-autocomplete>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
    <el-table :data="buildingData" height="400" border stripe style="width: 80%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="楼栋名"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="units" label="所有单元"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="楼栋信息" width="400px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="buildingForm" :label-position="labelPosition" ref="buildingForm">
        <el-row>
          <el-col :span="20">
            <el-form-item 
              label="楼栋名:" 
              :label-width="formLabelWidth"
              prop="name"
              :rules="[{ required: true, message: '楼栋名不能为空', trigger: 'blur' }]">
              <el-input v-model="buildingForm.name" autocomplete="off" placeholder="请输入楼栋名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item 
              label="楼栋类型:" 
              :label-width="formLabelWidth"
              prop="type"
              :rules="[{ required: true, message: '请选择楼栋类型', trigger: 'visible-change' }]">
              <el-select v-model="buildingForm.type" placeholder="请选择楼栋类型">
                <el-option label="电梯房" value="1"></el-option>
                <el-option label="楼梯房" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" 
            v-for="(item, index) in buildingForm.units" 
            :key="item.key">
            <el-col :span="20">
              <el-form-item 
              :label="'单元' + (index+1)"
              :label-width="formLabelWidth"
              class="unit"
              :prop="'units.' + index + '.value'"
              :rules="{ required: true, message: '单元名不能为空', trigger: 'blur' }">
              <el-input v-model="item.value" placeholder="请输入单元名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button @click.prevent="removeUnit(item)">删除</el-button>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUnit">新增单元</el-button>
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('buildingForm')">确 定</el-button>
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
import { getBuilding, addBuilding, deleteBuilding, getBuildingNameAll, updateBuilding } from "@/service/building"
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 10,
      buildingId: 0,
      handleLogo: 1,
      searchBuilding: '',
      handleAddDialog: false,
      formLabelWidth: '82px',
      labelPosition: 'left',
      buildingData: [],
      buildingForm: {
        name: '',
        type: '',
        units: [{ value: '' }]
      }
    }
  },
  created() {
    this._getBuilding("",this.page,this.limit)
  },
  methods: {
    _getBuilding(name, page, limit){
      getBuilding({name, page, limit})
      .then(res => {
        if(res.status === 201) {
          const buildingAll = res.data.building.rows
          this.total = res.data.building.count
          this.buildingData = buildingAll.map(item => { //map不改变原数组
            item.type === 2 ? item.type = "楼梯房" : item.type = "电梯房"
            return item
          })
        } else {
          this.$message.error('数据查询失败')
        }
      })
    },
    querySearch(queryString, cb) {
      getBuildingNameAll()
      .then(res => {
        let allBuilding = res.data.building
        let results = queryString ? allBuilding.filter(this.createFilter(queryString)) : allBuilding
        // 调用 callback 返回建议列表的数据
        cb(results)
      })
    },
    createFilter(queryString) {
      return (build) => {
        return (build.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    handleSearch() {
     if (this.searchBuilding == '') {
      this._getBuilding(this.searchBuilding,1,this.limit)
     } else {
       this._getBuilding(this.searchBuilding,1,this.total)
     }
    },
    handleAdd() {
      this.handleAddDialog = true
      this.handleLogo = 2
      this.buildingForm = {
        name : '',
        type: '',
        units: [{value: ''}]
      }
    },
    confirm(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          let units = this.buildingForm.units
          let newUnits = units.map(item => {
            return item.value
          })
          this.buildingForm.units = newUnits.join()
          if (this.handleLogo === 1) {
            updateBuilding({
              name: this.buildingForm.name,
              type: this.buildingForm.type === "电梯房" ? 1 : 2,
              units: this.buildingForm.units
            }, this.buildingId)
            .then(res => {
              if (res.data.code === 200) {
                this._getBuilding(this.searchBuilding,1,this.limit)
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message.error('修改失败')
              }
            })
          } else {
            addBuilding(this.buildingForm).then(res => {
              if (res.data.code === 200) {
                this._getBuilding(this.searchBuilding,this.page,this.limit)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加失败')
              }
            })
          }
          this.handleAddDialog = false
          this.buildingForm = {
            name: '',
            type: '',
            units: [{ value: '' }]
          }
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      this.handleLogo = 1
      this.handleAddDialog = true
      this.buildingId = data.id
      this.buildingForm.name = data.name
      this.buildingForm.type = data.type 
      let units = data.units
      units = units.split(",")
      let arrUnits = new Array(units.length)
      for(let i = 0; i< arrUnits.length; i++) {
        arrUnits[i] = {value: units[i]}
      }
      this.buildingForm.units = arrUnits
    },
    handleDelete(index, data) {
      console.log(index, data)
      const id = data.id
      deleteBuilding({id})
      .then(res => {
        if(res.data.code === 200) {
          this._getBuilding(this.searchBuilding,this.page,this.limit)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    removeUnit(item) {
      let index = this.buildingForm.units.indexOf(item)
        if (index !== -1) {
          if ( this.buildingForm.units.length > 1 ) {
            this.buildingForm.units.splice(index, 1)
          } else {
            this.$message({
              message: '至少要有一个单元',
              type: 'warning'
            })
          }
        }
    },
    addUnit() {
      this.buildingForm.units.push({
        value: '',
        key: Date.now()
      })
    },
    sizeChange(val) {
      this.limit = val
      this._getBuilding(this.searchBuilding,this.page,this.limit)
    },
    currentChange(val) {
      this.page = val
      this._getBuilding(this.searchBuilding, this.page, this.limit)
    }
  },
}
</script>

<style lang="scss" scoped>
  .building {
    .search {
      margin-bottom: 10px;
      display: flex;
      .inline-input {
        margin-right: 10px;
      }
    }
  }
</style>