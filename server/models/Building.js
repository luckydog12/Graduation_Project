const Sequelize = require('sequelize')

module.exports = ( sequelize, DataTypes) => {
    class Model extends Sequelize.Model { }
    Model.init({
        name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: {
                msg:'该楼栋已存在'
            }
        },
        type: {
            type: Sequelize.DataTypes.INTEGER, //1电梯房 2楼梯房
            allowNull: false
        },
        units: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },
    {
      sequelize,
      modelName: 'Building'
    }
    )
    return Model 
}
