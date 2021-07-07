<template>
  <div>
    <el-button type="primary" @click="handleService">投诉/报修</el-button>
     <el-dialog title="投诉/报修信息" width="500px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="form" label-position="left" ref="form" label-width="90px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="内容: " prop="content"
              :rules="[{ required: true, message: '内容不能为空', trigger: 'blur' }]">
              <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入内容">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="serviceForm" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="content" label="投诉/报修内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_at" label="发布时间"></el-table-column>
      <el-table-column prop="state" label="处理状态"></el-table-column>
      <el-table-column prop="handled_at" label="处理时间"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getService, deleteService, addService, updateService } from '@/service/service'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      handleLogo: 1,
      handleAddDialog: false,
      form: {
        content: ''
      },
      serviceForm: []
    }
  },
  computed: {
    ...mapState({
      userId: state=>state.user.id
    })
  },
  created() {
    this._getService(this.userId, 1, 9999)
  },
  methods: {
     _getService(createUser, page, limit) {
      getService({createUser, page, limit})
      .then(res => {
        if (res.data.code === 200) {
          const serviceForm = res.data.service.rows
          this.serviceForm = serviceForm.map(item => {
            const date = item.createdAt
            const tempDate = new Date()
            tempDate.setTime(Date.parse(date) + 3600 * 1000 * 8)
            item.created_at = tempDate.toLocaleDateString()
            if (item.state === 2) {
              item.state = '未处理'
              item.handled_at = '-'
            } else {
              item.state = '已处理'
              const date2 = item.handleAt
              const tempDate2 = new Date()
              tempDate2.setTime(Date.parse(date2) + 3600 * 1000 * 8)
              item.handled_at = tempDate2.toLocaleDateString()
            }
            return item
          })

        } else {
          this.$message.error('获取数据出错')
        }
      })
    },
    handleService() {
      this.handleLogo = 1
      this.handleAddDialog = true
    },
    handleEdit(index, data) {
      this.handleLogo = 2
      this.handleAddDialog = true
      this.form.serviceId = data.id
      this.form.content = data.content
    },
    handleDelete(index, data) {
      const serviceId = data.id
      deleteService(serviceId)
      .then(res => {
        if (res.data.code === 200) {
          this.$message.success('删除成功')
          this._getService(this.userId, 1, 9999)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    confirm(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          if (this.handleLogo === 1) {
            //添加操作
            addService({
              content: this.form.content,
              createUser: this.userId
            })
            .then(res => {
              if (res.data.code === 200) {
                this._getService(this.userId, 1, 9999)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              } else {
                this.$message.error('添加出错')
              }
            })
          } else {
            //修改操作
            updateService({
              content: this.form.content
            }, this.form.serviceId)
            .then(res => {
              if (res.data.code === 200) {
                this._getService(this.userId, 1, 9999)
                this.$message.success('修改成功')
              } else {
                this.$message.error('修改失败')
              }
            })
          }
          this.handleAddDialog = false
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .el-button {
    margin-bottom: 20px;
  }
</style>