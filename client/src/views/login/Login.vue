<template>
  <div class="login-container">
    <el-form label-width="80px" :label-position="labelPosition" class="login-form" ref="loginForm" :model="loginForm"
      :rules="loginRules">
      <div class="info-err">{{error}}</div>
      <el-form-item prop='account' label='账号'>
        <el-input v-model="loginForm.account"></el-input>
      </el-form-item>
      <el-form-item prop='password' label='密码'>
        <el-input v-model="loginForm.password" show-password @keyup.enter.native="handleLogin"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom:0;">
        <span>请选择登录身份：</span>
        <el-radio-group v-model="radio">
          <el-radio :label="1">管理员</el-radio>
          <el-radio :label="2">业主</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" :loading='loading' @click="handleLogin">登录</el-button>
      <div class="info">业主如果没有注册账号，请联系管理员或<router-link to="./register">点击注册</router-link>
      </div>
    </el-form>
    <!-- 滑块拼图 -->
    <Vcode :show="isShow" successText="验证通过，登陆中" failText="验证失败，请重试" sliderText="拖动滑块完成拼图" @success="success"
      @close="close" />
  </div>
</template>

<script>
  import Vcode from "vue-puzzle-vcode"
  import {
    login
  } from "../../service/login"
  import {
    mapState
  } from 'vuex'
  export default {
    components: {
      Vcode
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    data() {
      return {
        radio: 1,
        labelPosition: 'right',
        error: '',
        loading: false,
        isShow: false,
        loginForm: {
          account: '',
          password: '',
        },
        loginRules: {
          account: {
            type: 'string',
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          },
          password: {
            type: 'string',
            required: true,
            min: 5,
            max: 20,
            message: '密码不能为空且长度必须大于4小于20',
            trigger: 'blur'
          },
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            login({
                account: this.loginForm.account,
                password: this.loginForm.password,
                identity: this.radio
              })
              .then((res) => {
                if (res.data.code === 200) {
                  this.loading = true
                  this.isShow = true
                  this.$store.dispatch('setToken', res.data.token)
                  this.$store.dispatch('setUser', res.data.user)
                } else {
                  this.error = res.data.error
                }
              })
          }
        })
      },
      success() {
        this.isShow = true
        setTimeout(() => {
          this.$router.push({
            name: 'Index'
          })
        }, 500)

      },
      close() {
        //此函数定义点击图片外时的操作
        this.isShow = true
      }
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
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

    .login-form {
      border-radius: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 350px;
      background: rgba($color: #fff, $alpha: 0.6);
      padding: 20px;

      .info {
        font-size: 14px;
        text-align: right;
        color: #697685;
        margin-top: 10px;
      }

      .el-button {
        display: block;
        margin: 0 auto;
      }
    }
  }
</style>