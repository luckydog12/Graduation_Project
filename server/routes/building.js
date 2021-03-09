const express = require('express')
const router = express.Router()
const BuildingController = require('../controllers/BuildingController')

router.post('/addBuilding', BuildingController.addBuilding)
router.post('/updateBuilding', BuildingController.updateBuildling)
router.post('/deleteBuilding', BuildingController.deleteBuilding)
router.post('/getBuilding', BuildingController.getBuilding)
router.get('/getBuildingNameAll', BuildingController.getBuildingNameAll)

module.exports = router
