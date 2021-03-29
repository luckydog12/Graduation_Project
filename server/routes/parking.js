const express = require('express')
const router = express.Router()
const ParkingController = require('../controllers/ParkingController')

router.post('/addParking', ParkingController.addParking)
router.post('/updateParking', ParkingController.updateParking)
router.post('/deleteParking', ParkingController.deleteParking)
router.post('/getParking', ParkingController.getParking)

module.exports = router
