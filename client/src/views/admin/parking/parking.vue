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
            <el-option label="未卖出" value="weimaichu"></el-option>
            <el-option label="已卖出" value="yimaichu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型: ">
          <el-select v-model="searchForm.type" clearable placeholder="请选择车位类型">
            <el-option label="地上" value="dishang"></el-option>
            <el-option label="地下" value="dixia"></el-option>
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
      <el-table-column prop="parkingName" label="车位名"></el-table-column>
      <el-table-column prop="parkingState" label="车位状态"></el-table-column>
      <el-table-column prop="parkingType" label="车位类型"></el-table-column>
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
            <el-form-item label="车位名:" :label-width="formLabelWidth" prop="parkingName"
              :rules="[{ required: true, message: '车位名不能为空', trigger: 'blur' }]">
              <el-input v-model="parkingFormDialog.parkingName" autocomplete="off" placeholder="请输入车位名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="车位状态:" :label-width="formLabelWidth" prop="parkingState"
              :rules="[{ required: true, message: '请选择车位状态', trigger: 'change' }]">
              <el-select v-model="parkingFormDialog.parkingState" placeholder="请选择车位状态">
                <el-option label="未卖出" value="weimaichu"></el-option>
                <el-option label="已卖出" value="yimaichu"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="车位类型:" :label-width="formLabelWidth" prop="parkingType"
              :rules="[{ required: true, message: '请选择车位类型', trigger: 'change' }]">
              <el-select v-model="parkingFormDialog.parkingType" placeholder="请选择车位类型">
                <el-option label="地上" value="dishang"></el-option>
                <el-option label="地下" value="dixia"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="所属业主:" :label-width="formLabelWidth" prop="hasUser"
              :rules="[{ required: true, message: '请选择所属业主', trigger: 'change' }]">
              <el-autocomplete class="inline-input" v-model="parkingFormDialog.hasUser" placeholder="请输入业主名"
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
      allOwner: [ {value: 'luckydog'}, {value: 'luckydog2'} ],
      allParking: [ {value: 'A'}, {value: 'B'} ],
      handleAddDialog: false,
      formLabelWidth: '110px',
      labelPosition: 'left',
      searchForm: {
        name: '',
        state: '',
        type: ''
      },
      parkingData: [{
        parkingName: '车位1',
        parkingState: '未卖出',
        parkingType: '地上',
        hasUser: '暂无'
      }, {
        parkingName: '车位2',
        parkingState: '已卖出',
        parkingType: '地上',
        hasUser: 'luckydog'
      }],
      parkingFormDialog: {
       parkingName: '',
       parkingType: '',
       parkingState: '',
       hasUser: '暂无'
      },
    }
  },
  methods: {
    querySearchParking(queryString, cb) {
      let allParking = this.allParking
      let results = queryString ? allParking.filter(this.createFilterParking(queryString)) : allParking
      // 调用 callback 返回建议列表的数据
      cb(results)
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

    },
    handleAddParking() {
      this.handleAddDialog = true
      this.handleLogo = 2
    },
    confirm(formName) {
      console.log('confirm')
      this.$refs[formName].validate( valid => {
        if (valid) {
          if (this.handleLogo === 1) {
            console.log('编辑操作')
          } else {
            console.log('添加操作')
          }
          this.handleAddDialog = false
          this.parkingFormDialog = {
            parkingName: '',
            parkingState: '',
            parkingType: '',
            hasUser: '暂无'
          }
          console.log('11')
        } else {
          return false
        }
      })
    },
    handleEdit(index, data) {
      console.log(index, data)
      this.handleLogo = 1
      this.handleAddDialog = true
      Object.assign(this.parkingFormDialog, data)
      this.parkingFormDialog.belongTo = this.handleCascader(data.belongTo)
      this.parkingFormDialog.houseArea = this.handleHouseArea(data.houseArea)
      console.log('**',this.parkingFormDialog)
      //记得编辑后把表单清空，现在懒得写。。。。  
    },
    handleDelete(index, data) {
      console.log(index, data)
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
      console.log('dad',val)
    },
    currentChange(val) {
      console.log('dad', val)
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
  
</style>