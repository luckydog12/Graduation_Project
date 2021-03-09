<template>
  <div class="bulletin">
    <el-container>
      <el-header>
        <span>发布公告</span>
      </el-header>
      <el-main>
        <el-form :model="bulletinForm" :rules="rules" ref="bulletinForm" 
          :label-width="labelWidth" :label-position="labelPosition">
          <el-row>
            <el-col :span="10">
              <el-form-item label="标题: " prop="title">
                <el-input v-model="bulletinForm.title" placeholder="请输入公告标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="内容: " prop="content">
                <el-input type="textarea" v-model="bulletinForm.content" placeholder="请输入公告内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="发布时间:" prop="publish">
                <el-select v-model="bulletinForm.publish" clearable placeholder="请选择发布时间">
                  <el-option label="现在立刻发布" value="now"></el-option>
                  <el-option label="稍后自行发布" value="later"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item>
                <el-button type="primary" @click="save('bulletinForm')">保存</el-button>
                <el-button type="primary" @click="back">返回</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      user: state=>state.user.identity
    })
  },
  data() {
    return {
      labelWidth: '90px',
      labelPosition: 'left',
      bulletinForm: {
        title: '',
        content: '',
        publish: ''
      }, 
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        publish: [{ required: true, message: '请选择发布时间', trigger: 'change' }]
      }
    }
  },
  methods: {
    save(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          if (this.user === 1) {
            this.$router.push({ name: '公告管理' })
          } else {
            this.$router.push({ name: '查看公告' })
          }
        } else {
          return false
        }
      })
    },
    back() {
      if (this.user === 1) {
        this.$router.push({ name: '公告管理' })
      } else {
        this.$router.push({ name: '查看公告' })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .bulletin {
    width: 95%;
    margin:  20px auto;
    .el-header {
      background-color: #B3C0D1;
      color: #333;
      text-align: left;
      line-height: 60px;
    }
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      line-height: 160px;
    }
  }
</style>