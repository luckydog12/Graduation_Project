const express = require('express')
const router = express.Router()
const AlipayController = require('../controllers/AlipayController')

router.post('/sandbox', AlipayController.alipayTool)
router.post('/payStatus', AlipayController.payStatus)
module.exports = router
