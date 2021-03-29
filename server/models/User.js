const Sequelize = require('sequelize')
// const MD5 = require('crypto-js/md5')
// const hashPassword = ( user, options) => {
//     if (user.changed('password')) {
//         user.password = MD5(user.password).toString()
//     }
// }

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {
    compareInfo(password, identity) {
      // return this.password === MD5(password).toString()
      return this.password === password && this.identity === identity
    }
  }
  Model.init({
    account: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '该账号已被注册，请更换'
      }
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          min: 5,
          max: 20,
          msg: '密码长度必须大于等于5小于20'
        }
      }
    },
    identity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2 //设置默认值 1表示管理员 2表示业主
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true
    },
    sex: {
      type: Sequelize.DataTypes.INTEGER, //1代表男性 2代表女性
      allowNull: true
    },
    age: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    // hooks: {
    //     afterValidate: hashPassword
    // },
    sequelize,
    modelName: 'User'
  })
  return Model
}