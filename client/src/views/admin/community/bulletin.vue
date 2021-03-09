<template>
  <div class="bulletin">
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="标题: ">
          <el-input v-model="searchForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容: ">
          <el-input v-model="searchForm.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="创建者: ">
          <el-autocomplete class="inline-input" v-model="searchForm.user" placeholder="请输入管理员昵称"
            :fetch-suggestions="querySearchUser" @select="handleSelectUser">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态: ">
          <el-select v-model="searchForm.state" clearable placeholder="请选择公告状态">
            <el-option label="未发布" value="weifabu"></el-option>
            <el-option label="已发布" value="yifabu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间:">
          <el-date-picker v-model="searchForm.published_at" type="daterange" unlink-panels
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button type="primary" @click="handleAddBulletin">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="bulletin" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="公告标题"></el-table-column>
      <el-table-column prop="content" label="公告内容"></el-table-column>
      <el-table-column prop="publishUser" label="创建者"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="modifyUser" label="修改者"></el-table-column>
      <el-table-column prop="updated_at" label="修改时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column prop="published_at" label="发布时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" @click="handlePublish(scope.$index, scope.row)">发布</el-button>
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
  data() {
    return {
      allUser: [ {value: 'admin'}, {value: 'admin2'} ],
      searchForm: {
        title: '',
        content: '',
        user: '',
        state: '',
        published_at: ''
      },
      bulletin: [{
        title: '公告1',
        content: '啥事没有哈',
        publishUser: 'admin',
        created_at: '2021-2-15',
        modifyUser: 'admin2',
        updated_at: '2021-2-16',
        state: '未发布',
        published_at: ''
      }, {
        title: '公告2',
        content: '啥事没有哈',
        publishUser: 'admin',
        created_at: '2021-2-15',
        modifyUser: 'admin2',
        updated_at: '2021-2-16',
        state: '已发布',
        published_at: '2021-2-16'
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
      return (parking) => {
        return (parking.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      }
    },
    handleSelectUser(item) {
      console.log(item)
    },
    handleSearch() {

    },
    handleAddBulletin() {
      this.$router.push( {name: 'CommonBulletin'} )
    },
    handlePublish(index, data) {
      console.log(index, data)
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