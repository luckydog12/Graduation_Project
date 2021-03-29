const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Model extends Sequelize.Model {}
  Model.init({
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: '该标题已存在'
      }
    },
    content: {
      type: Sequelize.DataTypes.TEXT, 
      allowNull: false
    },
    createUser: { //外键
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    state: {
      type: Sequelize.DataTypes.INTEGER, //1已发布 2未发布
      allowNull: false
    },
    publishAt: {
      type: Sequelize.DataTypes.DATE, //发布时间
      allowNull: true
    }
  }, {
    sequelize,
    // force: true,
    modelName: 'Bulletin'
  })
  return Model
}