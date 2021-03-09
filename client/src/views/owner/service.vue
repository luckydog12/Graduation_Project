<template>
  <div>
    <el-button type="primary" @click="handleComplaint">投诉</el-button>
     <el-dialog title="投诉信息" width="500px" 
      :close-on-click-modal="false" :visible.sync="handleAddDialog">
      <el-form :model="form" label-position="left" ref="form" label-width="90px">
        <el-row>
          <el-col :span="20">
            <el-form-item label="投诉内容: " prop="content"
              :rules="[{ required: true, message: '内容不能为空', trigger: 'blur' }]">
              <el-input type="textarea" v-model="form.content" autocomplete="off" placeholder="请输入投诉内容">
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
    <el-table :data="complaintTable" height="400" border stripe style="width: 90%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="content" label="投诉内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_at" label="发布时间"></el-table-column>
      <el-table-column prop="state" label="处理状态"></el-table-column>
      <el-table-column prop="handleUser" label="处理人"></el-table-column>
      <el-table-column prop="handled_at" label="处理时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      handleAddDialog: false,
      form: {
        content: ''
      },
      complaintTable: [{
        content: '楼上太吵了',
        created_at: '2021-2-26',
        state: '已处理',
        handleUser: 'admin',
        handled_at: '2021-2-28'
      }]
    }
  },
  methods: {
    handleComplaint() {
      this.handleAddDialog = true
    },
    confirm(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          console.log('11')
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