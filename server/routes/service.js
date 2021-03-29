const express = require('express')
const router = express.Router()
const ServiceController = require('../controllers/ServiceController')

router.post('/addService', ServiceController.addService)
router.post('/updateService', ServiceController.updateService)
router.post('/deleteService', ServiceController.deleteService)
router.post('/getService', ServiceController.getService)

module.exports = router
