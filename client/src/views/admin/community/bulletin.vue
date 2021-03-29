<template>
  <div class="bulletin" ref='elMain'>
    <div class="search">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline" 
        :label-position="labelPosition" :label-width="labelWidth">
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题: ">
              <el-input v-model="searchForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="内容: ">
              <el-input v-model="searchForm.content" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态: ">
              <el-select v-model="searchForm.state" clearable placeholder="请选择公告状态">
                <el-option label="未发布" value="2"></el-option>
                <el-option label="已发布" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发布时间:">
              <el-date-picker v-model="searchForm.published_at" type="daterange" unlink-panels
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button type="primary" @click="handleAddBulletin">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table :data="bulletin" border stripe style="width: 90%" height="400">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="公告标题"></el-table-column>
      <el-table-column prop="content" label="公告内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createUser" label="创建者"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column prop="published_at" label="发布时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">   
          <el-button type="text" v-if="scope.row.state === '已发布' ? false : true " @click="handlePublish(scope.$index, scope.row)">发布</el-button>
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="公告信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="bulletinFormDialog" :rules="rules" ref="bulletinFormDialog" 
          :label-width="labelWidthDialog" :label-position="labelPositionDialog">
        <el-row>
          <el-col :span="20">
            <el-form-item label="标题: " prop="title">
              <el-input v-model="bulletinFormDialog.title" placeholder="请输入公告标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="内容: " prop="content">
              <el-input type="textarea" v-model="bulletinFormDialog.content" placeholder="请输入公告内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20" v-if="this.handleLogo === 1">
            <el-form-item label="发布时间:" prop="publishAt">
              <el-select v-model="bulletinFormDialog.publishAt" clearable placeholder="请选择发布时间">
                <el-option label="现在立刻发布" value="now"></el-option>
                <el-option label="稍后自行发布" value="later"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('bulletinFormDialog')">确 定</el-button>
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
import { getBulletin, deleteBulletin, addBulletin, updateBulletin } from '@/service/bulletin'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      handleLogo: 1,
      labelWidth: "80px",
      labelPosition: 'left',
      searchForm: {
        title: '',
        content: '',
        state: '',
        published_at: ''
      },
      labelWidthDialog: '90px',
      labelPositionDialog: 'left',
      dialogFormVisible: false,
      bulletinFormDialog: {
        title: '',
        content: '',
        publishAt: ''
      }, 
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        publishAt: [{ required: true, message: '请选择发布时间', trigger: 'visible-change' }]
      },
      bulletin: []
    }
  },
  computed: {
    ...mapState({
      userId: state=>state.user.id
    })
  },
  created() {
    this._getBulletin('', '', null, null, 1, 9999)
  },
  methods: {
    _getBulletin(title, content, state, publishAt, page, limit) {
      getBulletin({title, content, state, publishAt, page, limit})
      .then(res => {
        if (res.data.code === 200) {
          const bulletin = res.data.bulletin.rows
          this.total = res.data.bulletin.count
          this.bulletin = bulletin.map(item => {
            item.createUser = item['User.account']
            let date = item.createdAt
            date = new Date(Date.parse(date))
            item.created_at = date.toLocaleDateString()
            if (item.state === 1) {
              item.state = '已发布'
              let date2 = item.publishAt
              date2 = new Date(Date.parse(date2))
              item.published_at = date2.toLocaleDateString()
            } else {
              item.state = '未发布'
              item.published_at = '-'
            }
            return item
          })
        } else {
          this.$message.error('获取公告出错')
        }
      })
      .catch((error) => {
        this.$message.error(error)
      })
    },
    handleSearch() {
      console.log(this.searchForm)
      this.page = 1
      this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
        this.searchForm.published_at, this.page, this.limit)
    },
    handleAddBulletin() {
      this.handleLogo = 1
      this.dialogFormVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.handleLogo === 1) {
            //添加操作
            addBulletin({
              title: this.bulletinFormDialog.title,
              content: this.bulletinFormDialog.content,
              createUser: this.userId,
              state: this.bulletinFormDialog.publishAt === 'now' ? 1 : 2,
              publishAt: this.bulletinFormDialog.publishAt === 'now'? (new Date()).toLocaleDateString() : null
            })
            .then(res => {
              console.log(res)
              if (res.data.code === 200) {
                this.$message.success('添加成功')
                this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
                  this.searchForm.published_at, this.page, this.limit)
              } else {
                this.$message.error('添加失败')
              }
            })
          } else {
            //修改操作
            updateBulletin({
              title: this.bulletinFormDialog.title,
              content: this.bulletinFormDialog.content
            },this.bulletinFormDialog.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success('修改成功')
                this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
                  this.searchForm.published_at, this.page, this.limit)
              } else {
                this.$message.error('修改失败')
              }
            })
          }
          this.$refs[formName].resetFields()
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    handlePublish(index, data) {
      console.log(index, data)
      const id = data.id
      const date = new Date()
      updateBulletin({state: 1, publishAt: date}, id)
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success('发布成功')
          this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
            this.searchForm.published_at, this.page, this.limit)
        } else {
          this.$message.error('发布失败')
        }
      })
    },
    handleEdit(index, data) {
      console.log(index, data)
      this.handleLogo = 2
      this.dialogFormVisible = true
      this.bulletinFormDialog.title = data.title
      this.bulletinFormDialog.content = data.content
      this.bulletinFormDialog.id = data.id
      // this.$router.push( {name: 'CommonBulletin', query: {id:'1'}} )
    },
    handleDelete(index, data) {
      const bulletinId = data.id
      deleteBulletin(bulletinId)
      .then(res => {
        if (res.data.code === 200) {
          if (this.bulletin.length === 1 && this.page !== 1) {
            this.page -=1
          }
          this.$message.success('删除成功')
          this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
            this.searchForm.published_at, this.page, this.limit)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    sizeChange(val) {
      this.limit = val
      this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
        this.searchForm.published_at, this.page, this.limit)
    },
    currentChange(val) {
      this.page = val
      this._getBulletin(this.searchForm.title, this.searchForm.content, this.searchForm.state,
        this.searchForm.published_at, this.page, this.limit)
    },
  },
}
</script>

<style lang="scss" scoped>
  .el-date-editor--daterange.el-input__inner {
   width: 225px;
 }
</style>