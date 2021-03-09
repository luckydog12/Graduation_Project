const express = require('express')
const router = express.Router()
const HouseController = require('../controllers/HouseController')

router.post('/addHouse', HouseController.addHouse)
router.post('/updateHouse', HouseController.updateHouse)
router.post('/deleteHouse', HouseController.deleteHouse)
router.post('/getHouse', HouseController.getHouse)
router.get('/getHouseAll', HouseController.getHouseAll)

module.exports = router
