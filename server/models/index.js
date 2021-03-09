const config = require(`../config`)
const Sequelize = require(`sequelize`)
const path = require(`path`)
const fs = require(`fs`)
const db = {}

const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
)


fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js')
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

db.sequelize = sequelize
db.Sequelize = Sequelize


db.House.belongsTo(db.User, {foreignKey: 'belong_user'})
db.User.hasMany(db.House, {foreignKey: 'belong_user'})

//当需要向数据库添加列时 如下操作
// db['Movie'].sync({force: true})
// db['UserInfo'].sync({ alter: true })
module.exports = db
