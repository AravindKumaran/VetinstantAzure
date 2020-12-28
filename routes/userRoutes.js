const router = require('express').Router()

const { getAllUsers, getMe, saveVet } = require('../controllers/userCtrl')

const { protect, authorize } = require('../middleware/protect')

router.get('/', protect, authorize('admin'), getAllUsers)
router.patch('/me', protect, getMe)

router.patch('/updateVet', protect, authorize('user'), saveVet)

module.exports = router
