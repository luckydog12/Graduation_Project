const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { sequelize } = require('./models')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const buildingRouter = require('./routes/building')
const houseRouter = require('./routes/house')
const parkingRouter = require('./routes/parking')
const payTypeRouter = require('./routes/payType')
const payManageRouter = require('./routes/payManage')
const bulletinRouter = require('./routes/bulletin')
const serviceRouter = require('./routes/service')
const alipayRouter = require('./routes/alipay')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// app.use(require('cors')()) //使用cors需要解决预请求问题
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/building', buildingRouter)
app.use('/house', houseRouter)
app.use('/parking', parkingRouter)
app.use('/payType', payTypeRouter)
app.use('/payManage', payManageRouter)
app.use('/bulletin', bulletinRouter)
app.use('/service', serviceRouter)
app.use('/alipay', alipayRouter)
sequelize.sync().then(() => {
  console.log('Connection has been established successfully.')
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
