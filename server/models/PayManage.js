const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    belongType: { //外键
      type: Sequelize.DataTypes.INTEGER, 
      allowNull: true,
    },
    belongUser: { //外键
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true 
    },
    value: {
      type: Sequelize.DataTypes.FLOAT, 
      allowNull: false
    },
    deadLine: {
      type: Sequelize.DataTypes.DATE, 
      allowNull: false
    },
    payDate: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    state: {
      type: Sequelize.DataTypes.INTEGER, // 1已缴交 2未缴交
      allowNull: false,
      defaultValue: 2
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'PayManage'
  })
  return Model
}