const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
// const AuthenticatePolicy = require('../policies/AuthenticatePolicy')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/update', UserController.updateUser)
router.post('/delete', UserController.deleteUser)
router.post('/comparePwd', UserController.comparePwd)
router.post('/all', UserController.getUsersAll)
router.get('/account', UserController.getUserAccount)
router.get('/name', UserController.getUserName)

module.exports = router
