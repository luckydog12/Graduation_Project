const express = require('express')
const router = express.Router()
const BulletinController = require('../controllers/BulletinController')

router.post('/addBulletin', BulletinController.addBulletin)
router.post('/updateBulletin', BulletinController.updateBulletin)
router.post('/deleteBulletin', BulletinController.deleteBulletin)
router.post('/getBulletin', BulletinController.getBulletin)

module.exports = router
