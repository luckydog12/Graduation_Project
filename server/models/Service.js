const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    content: {
      type: Sequelize.DataTypes.TEXT, 
      allowNull: false
    },
    createUser: { //外键
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    img: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.DataTypes.INTEGER, //1已处理 2未处理
      allowNull: false,
      defaultValue: 2
    },
    handleAt: {
      type: Sequelize.DataTypes.DATE, //处理时间
      allowNull: true
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'Service'
  })
  return Model
}