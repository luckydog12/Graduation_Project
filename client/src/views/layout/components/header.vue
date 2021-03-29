<template>
  <div>
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown @command="handleCommand">
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>{{account ? account : null}}</span>
    </el-header>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="400px">
      <el-form :model="form" ref="form" :rules="rules" 
        :label-width="formLabelWidth" :label-position="formLabelPosition">
        <el-row>
          <el-col :span="20">
            <el-form-item label="原密码" prop="oldPwd">
              <div class="oldPwd">
                <el-input v-model="form.oldPwd" show-password></el-input>
                <v-icon v-if="show" icon-class="correct" class="correct" />
              </div>  
            </el-form-item>
            <el-form-item prop='newPwd' label='新密码'>
              <el-input v-model="form.newPwd" show-password></el-input>
            </el-form-item>
            <el-form-item prop='comparePwd' label='确认密码'>
              <el-input v-model="form.comparePwd" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapActions,
    mapState
  } from 'vuex'
  import { comparePwd, updateUser } from '@/service/login'
  export default {
    name: 'Header',
    data() {
      var validPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入原密码'))
        } else {
          this._comparePwd(value, this.id)
          if (this.isRight == '2') {
            callback(new Error('原密码错误，请重新输入'))
          } else {
            callback()
          }
        }
      }
      return {
        dialogFormVisible: false,
        formLabelWidth: "80px",
        formLabelPosition: "left",
        isRight: '',
        show: false,
        form: {
          oldPwd: null
        },
        rules: {
          oldPwd: [{required: true, validator: validPass, trigger: 'blur'}],
          newPwd: {type: 'string', required: true, min:5, max: 20, message: '密码不能为空且长度必须大于4小于20', trigger: 'blur'},
          comparePwd: {
              type: 'string', 
              required: true,  
              trigger: 'blur',
              validator: (rule, value, callback) => {
                  if(value === '') {
                      callback(new Error("请再次输入密码"))
                  } else if(value !== this.form.newPwd) {
                      callback(new Error("两次输入的密码不一致"))
                  } else {
                      callback()
                  }
              }
          }
        }
      }
    },
    computed: {
      ...mapState({
        account: state => state.user.account,
        id: state=>state.user.id
      })
    },
    methods: {
      ...mapActions([
        'setUser',
        'setToken'
      ]),
      //退出原理： 清空vuex中state信息
      logout() {
        this.setUser(null)
        this.setToken('')
        this.$router.push({
          name: 'Login'
        })
      },
      _comparePwd(oldPwd, id) {
        comparePwd({oldPwd}, id)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.result === 1) {
              this.isRight = '原密码正确'
              this.show = true
            } else {
              this.isRight = '2'
            }
          } else {
            this.$message.error('获取数据出错')
          }
        })
      },
      handleCommand(routeName) {
        if (routeName === 'logout') {
          this.logout()
        } else if (routeName === 'personal') {
          this.$router.push({
            name: routeName
          })
        } else {
          this.dialogFormVisible = true
        }
      },
      confirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(this.form)
            updateUser({password: this.form.newPwd}, this.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success('恭喜，密码修改成功')
              } else {
                this.$message.error('密码修改失败,请重试')
              }
            })
            this.dialogFormVisible = false 
            this.$refs[formName].resetFields()
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .oldPwd {
    display: flex;
    align-items: center;
    .correct {
      margin-left: 10px;
      font-size: 26px;
    }
  }
</style>