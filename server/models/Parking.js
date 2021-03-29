const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '该车位已存在'
      }
    },
    state: {
      type: Sequelize.DataTypes.INTEGER, //1已卖出 2未卖出
      allowNull: false
    },
    type: {
      type: Sequelize.DataTypes.INTEGER, //1地上 2地下
      allowNull: false
    },
    belongUser: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true //外键 true
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'Parking'
  })
  return Model
}