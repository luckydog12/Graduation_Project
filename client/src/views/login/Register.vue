<template>
  <div class="register-container">
    <el-form 
      label-width="100px" 
      :label-position="labelPosition"
      class="register-form" 
      ref="registerForm" 
      :model="registerForm" 
      :rules="registerRules"
    >
      <div class="info-err">{{error}}</div>
      <el-form-item prop='account' label='账号' class="label-color">
          <el-input v-model="registerForm.account"></el-input>
      </el-form-item>
      <el-form-item prop='password' label='密码'>
          <el-input v-model="registerForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item prop='comparePassword' label='确认密码'>
          <el-input v-model="registerForm.comparePassword" show-password></el-input>
      </el-form-item>
      <el-button type="primary" :loading='loading' @click="handleRegister">注册</el-button>
      <div class="info">如果已注册账号，请<router-link to="./login">点击登录</router-link></div>
    </el-form>
  </div>
</template>

<script>
import {register} from '../../service/login'
export default {
  data() {
    return {
      labelPosition: 'right',
      error: '',
      loading: false,
      registerForm : {
        account: '',
        password: '',
        comparePassword: ''
      },
      registerRules: {
          account: {type: 'string', required: true, message: '账号不能为空', trigger: 'blur'},
          password: {type: 'string', required: true, min:5, max: 20, message: '密码不能为空且长度必须大于4小于20', trigger: 'blur'},
          comparePassword: {
              type: 'string', 
              required: true,  
              trigger: 'blur',
              validator: (rule, value, callback) => {
                  if(value === '') {
                      callback(new Error("请再次输入密码"))
                  } else if(value !== this.registerForm.password) {
                      callback(new Error("两次输入的密码不一致"))
                  } else {
                      callback()
                  }
              }
          }
      }
    }
  },
  methods: {
    handleRegister() {
      this.$refs['registerForm'].validate(async (valid) => {
        if(valid) {
          register({
            account: this.registerForm.account,
            password: this.registerForm.password})
          .then( (res) => {
            if (res.data.code === 200) {
              console.log('success:',res.data)
              this.loading = true
              this.$router.push({name: 'Temp'})
            } else {
              console.log('error:',res.data)
              this.error = res.data.error
            }
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
    .register-container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background-image: url("../../image/user/background.jpeg");
        background-size: cover;
        background-repeat: no-repeat;
        .info-err {
            text-align: right;
            color: red;
            margin-bottom: 5px;
        }
        .register-form {
            border-radius: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 350px;
            background: rgba($color: #fff, $alpha: 0.6);
            padding: 20px;
            .el-button {
                display: block;
                margin: 0 auto;
            }
            .info {
                text-align: right;
                color: #909399;
                margin-top: 10px;
            }
        }
    }
</style>