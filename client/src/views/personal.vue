<template>
    <div class="personal">
      <el-form 
        :model="personalInfo" 
        :rules="personalInfoRules" 
        ref="personalInfo" 
        label-width="100px" 
        :label-position="labelPosition"
      >
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="avatar">
              <!-- <img :src="personalInfo.circleUrl" alt="加载失败"> -->
              <img src="@/image/user/girl.jpg" alt="加载失败">
            </div>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账号 :" prop="account">
              <el-input v-model="personalInfo.account" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="密码 :" prop="password">
              <el-input v-model="personalInfo.password" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="姓名 :" prop="nickName">
              <el-input v-model="personalInfo.nickName" placeholder="请输入修改后的姓名" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别 :" prop="sex">
              <el-radio-group :disabled="disabled" v-model="personalInfo.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="年龄 :" prop="age">
              <el-input v-model.number="personalInfo.age" placeholder="请输入修改后的年龄" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系电话 :" prop="phoneNumber">
              <el-input v-model.number="personalInfo.phoneNumber" placeholder="请输入修改后的联系电话" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="隶属车位 :" prop="parking">
              <el-input v-model="personalInfo.parking" placeholder="请输入修改后的车位" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="隶属房屋 :" prop="house">
              <!-- <el-input v-model="personalInfo.house" placeholder="请输入修改后的房屋信息" :disabled="disabled"></el-input> -->
              <el-cascader 
                placeholder="请选择隶属房屋" 
                v-model="personalInfo.house"
                :options="optionsHouse" 
                filterable 
                clearable 
                :disabled="disabled">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="个人简介 :" prop="profile">
              <el-input type="textarea" v-model="personalInfo.profile"
                placeholder="写点什么来介绍下自己吧~~" :disabled="disabled">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="edit">编辑</el-button>
      <el-button type="primary" v-show="ifShow" @click="save('personalInfo')">保存</el-button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "left",
      disabled: true,
      ifShow: false,
      personalInfo: {
        account: '',
        password: '',
        nickName: '',
        sex: '',
        age: '',
        phoneNumber: '12456',
        parking: '暂无车位',
        house: '',
        profile: '',
        // circleUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
        // cricleUrl: '@/image/user/girl.jpg'
      },
      personalInfoRules: {
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'change'}
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur'},
          { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '联系电话不能为空', trigger: 'blur'},
          { type: 'number', message: '电话必须为数字值', trigger: 'blur' }
        ],
        house: [
          { type: 'array', required: true, message: '请选择隶属房屋', trigger: 'change' }
        ]
      },
      optionsHouse: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'yizhi',
          label: '一致'
        }]
      }, {
        value: 'aa',
        label: 'A栋',
        children: [{
          value: 'a1',
          label: 'A1'
        }]
      }]
    }
  },
  methods: {
    edit() {
      this.disabled = false
      this.ifShow = true
    },
    save(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          this.disabled = true
          this.ifShow = false
          console.log('成功')
        } else {
          return false
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .personal {
    .el-input.is-disabled /deep/ .el-input__inner,
    .el-textarea.is-disabled /deep/ .el-textarea__inner {
      background-color: white;
      color: rgb(96, 98, 102);
    }
    .avatar {
      margin-bottom: 20px;
      img {
        width: 100px;
        height: 100px;
        // display: block;
        // margin: 0 auto;
      }
    } 
  }
</style>