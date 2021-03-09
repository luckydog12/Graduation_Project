<template>
  <div class="service">
    <p v-if="service">维修</p>
    <p v-else>投诉</p>
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="内容: ">
          <el-input v-model="searchForm.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="发布者: ">
          <el-autocomplete class="inline-input" v-model="searchForm.publishUser" placeholder="请输入用户昵称"
            :fetch-suggestions="querySearchUser" @select="handleSelectUser">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="处理人: ">
          <el-autocomplete class="inline-input" v-model="searchForm.handleUser" placeholder="请输入管理员昵称"
            :fetch-suggestions="querySearchAdmin" @select="handleSelectAdmin">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="searchForm.state" clearable placeholder="请选择处理状态">
            <el-option label="未处理" value="weichuli"></el-option>
            <el-option label="已处理" value="yichuli"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间:">
          <el-date-picker v-model="searchForm.published_at" type="daterange" unlink-panels
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleOver">一键处理</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="serviceForm" height="400" border stripe 
      style="width: 90%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column v-if="service" prop="content" label="维修内容" show-overflow-tooltip></el-table-column>
      <el-table-column v-else prop="content" label="投诉内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="publishUser" label="发布者"></el-table-column>
      <el-table-column prop="created_at" label="发布时间"></el-table-column>
      <el-table-column prop="state" label="处理状态"></el-table-column>
      <el-table-column prop="handleUser" label="处理人"></el-table-column>
      <el-table-column prop="handled_at" label="处理时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  created() {
    const path = this.$route.path
    path === '/communitySys/service' ? this.service = true : this.complaint = true
  },
  data() {
    return {
      service: false,
      complaint: false,
      multipleSelection: [],
      allUser: [ {value: 'admin'}, {value: 'admin2'} ],
      allAdmin: [ {value: 'admi3n'}, {value: 'admin2'} ],
      searchForm: {
        content: '',
        publishUser: '',
        handleUser: '',
        state: '',
        published_at: ''
      },
      serviceForm: [{
        content: '电梯坏了2222222222222222222222222222222',
        publishUser: 'luckydog',
        created_at: '2021-2-17',
        handleUser: '',
        state: '未处理',
        handled_at: ''
      }, {
        content: '电梯坏了',
        publishUser: 'luckydog',
        created_at: '2021-2-17',
        state: '已处理',
        handleUser: 'admin',
        handled_at: '2021-2-17'
      }]
    }
  },
  methods: {
    querySearchUser(queryString, cb) {
      let allUser = this.allUser
      let results = queryString ? allUser.filter(this.createFilterUser(queryString)) : allUser
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilterUser(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    handleSelectUser(item) {
      console.log(item)
    },
    querySearchAdmin(queryString, cb) {
      let allAdmin = this.allAdmin
      let results = queryString ? allAdmin.filter(this.createFilterUser(queryString)) : allAdmin
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelectAdmin(item) {
      console.log(item)
    },
    handleSearch() {

    },
    handleSelectionChange(val) {
        this.multipleSelection = val
        console.log('???',this.multipleSelection)
    },
    handleOver() {

    },
    handleEdit(index, data) {
      console.log(index, data)
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
 
</style>