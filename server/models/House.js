const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: Sequelize.DataTypes.INTEGER, //1已入住 2未入住
      allowNull: false
    },
    belongBuilding: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    belongUser: {
      type: Sequelize.DataTypes.STRING, //外键 integer类型
      allowNull: true
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'House'
  })
  return Model
}