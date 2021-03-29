const express = require('express')
const router = express.Router()
const PayManageController = require('../controllers/PayManageController')

router.post('/addPayManage', PayManageController.addPayManage)
router.post('/updatePayManage', PayManageController.updatePayManage)
router.post('/deletePayManage', PayManageController.deletePayManage)
router.post('/getPayManage', PayManageController.getPayManage)

module.exports = router
