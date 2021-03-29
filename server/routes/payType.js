const express = require('express')
const router = express.Router()
const PayTypeController = require('../controllers/PayTypeController')

router.post('/addPayType', PayTypeController.addPayType)
router.post('/updatePayType', PayTypeController.updatePayType)
router.get('/getPayType', PayTypeController.getPayType)

module.exports = router
