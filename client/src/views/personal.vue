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
            <el-form-item label="姓名 :">
              <el-input v-model="personalInfo.name" placeholder="请输入姓名" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="性别 :" prop="sex">
              <el-radio-group :disabled="disabled" v-model="personalInfo.sex">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
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
              <el-input v-model="personalInfo.parking" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="隶属房屋 :" prop="house">
              <el-input v-model="personalInfo.house" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" @click="edit">编辑</el-button>
      <el-button type="primary" v-show="ifShow" @click="save('personalInfo')">保存</el-button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUsersAll, updateUser } from '../service/login'
import { getParking } from '@/service/parking'
import { getHouse } from '@/service/house'
export default {
  data() {
    return {
      labelPosition: "left",
      disabled: true,
      ifShow: false,
      personalInfo: {
        name: '',
        sex: null,
        age: null,
        phoneNumber: '',
        parking: '',
        house: ''
      },
      personalInfoRules: {
        age: [
          { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
        ],
        phoneNumber: [
          { type: 'number', message: '电话必须为数字值', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userId: state=>state.user.id
    })
  },
  created() {
    this._getUsersAll(this.userId, 1)
    this._getParking(this.userId)
    this._getHouse(this.userId)
  },
  methods: {
    _getUsersAll(id, limit) {
      getUsersAll({id, limit})
      .then(res => {
        if (res.data.code === 200) {
          const personalInfo = res.data.user.rows[0]
          this.personalInfo.name = personalInfo.name
          this.personalInfo.age = personalInfo.age
          this.personalInfo.phoneNumber = parseInt(personalInfo.phoneNumber)
          personalInfo.sex === 1 ? this.personalInfo.sex = '1' : this.personalInfo.sex = '2'
        } else {
          this.$message.error('获取信息失败')
        }
      })
    },
    _getParking(belongUser) {
      getParking({belongUser})
      .then(res => {
        if (res.data.code === 200) {
          let parking = res.data.parking.rows
          parking = parking.map(item => {
            return `${item.name}   `
          })
          this.personalInfo.parking = parking.join('')
        } else {
          this.$message.error('获取车位信息失败')
        }
      })
    },
    _getHouse(belongUser) {
      getHouse({belongUser})
      .then(res => {
        if (res.data.code === 200) {
          let house = res.data.house.rows
          house = house.map(item => {
            return `${item.belongBuilding} / ${item.name}   `
          })
          this.personalInfo.house = house.join('')
        } else {
          this.$message.error('获取房屋信息失败')
        }
      })
    },
    edit() {
      this.disabled = false
      this.ifShow = true
    },
    save(formName) {
      this.$refs[formName].validate( valid => {
        if (valid) {
          this.disabled = true
          this.ifShow = false
          updateUser({
            name: this.personalInfo.name,
            sex: this.personalInfo.sex,
            age: this.personalInfo.age,
            phoneNumber: this.personalInfo.phoneNumber
          }, this.userId)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('修改成功')
              this._getUsersAll(this.userId, 1)
            } else {
              this.$message.error('修改失败')
            }
          })
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
    .el-form {
      margin-top: 20px;
    }
    .el-input.is-disabled /deep/ .el-input__inner,
    .el-textarea.is-disabled /deep/ .el-textarea__inner {
      background-color: white;
      color: rgb(96, 98, 102);
    }
  }
</style>