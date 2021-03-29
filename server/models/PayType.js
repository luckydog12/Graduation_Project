const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '该缴费类型已存在'
      }
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'PayType'
  })
  return Model
}