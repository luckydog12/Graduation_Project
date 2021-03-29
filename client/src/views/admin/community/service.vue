<template>
  <div class="service">
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
        <el-form-item label="状态: ">
          <el-select v-model="searchForm.state" clearable placeholder="请选择处理状态">
            <el-option label="未处理" value="2"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间:">
          <el-date-picker v-model="searchForm.published_at" type="daterange" unlink-panels
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="serviceForm" height="400" border stripe 
      style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="content" label="维修/投诉内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="publishUser" label="发布者"></el-table-column>
      <el-table-column prop="created_at" label="发布时间"></el-table-column>
      <el-table-column prop="state" label="处理状态"></el-table-column>
      <el-table-column prop="handled_at" label="处理时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" v-if="(scope.row.state) === '已处理' ? false : true" @click="handleEdit(scope.$index, scope.row)">处理</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { getService, deleteService, updateService } from '@/service/service'
import { getUsersAll } from '@/service/login'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      allUser: [],
      searchForm: {
        content: '',
        publishUser: '',
        state: '',
        published_at: ''
      },
      serviceForm: []
    }
  },
  created() {
    this._getService('', null, null, null, 1, 10)
    this._getUsersAll(9999)
  },
  methods: {
    _getService(content, state, createUser, createdAt, page, limit) {
      getService({content, state, createUser, createdAt, page, limit})
      .then(res => {
        console.log(res)
        if (res.data.code === 200) {
          const serviceForm = res.data.service.rows
          this.total = res.data.service.count
          this.serviceForm = serviceForm.map(item => {
            item.publishUser = item['User.account']
            let date = item.createdAt
            date = new Date(Date.parse(date))
            item.created_at = date.toLocaleDateString()
            if (item.state === 2) {
              item.state = '未处理'
              item.handled_at = '-'
            } else {
              item.state = '已处理'
              let date2 = item.handleAt
              date2 = new Date(Date.parse(date2))
              item.handled_at = date2.toLocaleDateString()
            }
            return item
          })
        } else {
          this.$message.error('获取数据出错')
        }
      })
    },
    _getUsersAll(limit) {
      getUsersAll({limit})
      .then(res => {
        if (res.data.code === 200) {
          this.allUser = []
          const allUser = res.data.user.rows
          allUser.map(item => {
            this.allUser.push({value: item.account, id: item.id})
          })
        } else {
          this.$message.error('获取用户账号出错')
        }
      })
    },
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
    handleSearch() {
      this.page = 1
      this.searchForm.id = null
      // const date = this.searchForm.published_at
      // if (date) {
      //   this.searchForm.published_at = date.map(item => {
      //     item.setTime(item.getTime() + 3600 * 1000 * 8) 
      //     return item
      //   })
      // }
      this.allUser.map(item => {
        if (this.searchForm.publishUser === item.value) {
          this.searchForm.id = item.id
        }
      })
      console.log(this.searchForm)
      this._getService(this.searchForm.content, this.searchForm.state, this.searchForm.id,
        this.searchForm.published_at, this.page, this.limit)
    },
    handleEdit(index, data) {
      console.log(data)
      const serviceId = data.id
      const date = new Date()
      updateService({state: 1, handleAt: date}, serviceId)
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success('已成功处理')
          this._getService(this.searchForm.content, this.searchForm.state, this.searchForm.publishUser,
            this.searchForm.published_at, this.page, this.limit)
        } else {
          this.$message.error('出错')
        }
      })
    },
    handleDelete(index, data) {
      const serviceId = data.id
      deleteService(serviceId)
      .then(res => {
        if (res.data.code === 200) {
          if (this.serviceForm.length === 1 && this.page !== 1) {
            this.page -=1
          }
          this.$message.success('删除成功')
          this._getService(this.searchForm.content, this.searchForm.state, this.searchForm.publishUser,
            this.searchForm.published_at, this.page, this.limit)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    sizeChange(val) {
      this.limit = val
      this._getService(this.searchForm.content, this.searchForm.state, this.searchForm.publishUser,
        this.searchForm.published_at, this.page, this.limit)
    },
    currentChange(val) {
      this.page = val
      this._getService(this.searchForm.content, this.searchForm.state, this.searchForm.publishUser,
        this.searchForm.published_at, this.page, this.limit)
    },
  },
}
</script>

<style lang="scss" scoped>
 
</style>