const router = require('express').Router()

const {
  getAllUsers,
  getMe,
  saveVet,
  userOffline,
} = require('../controllers/userCtrl')

const { protect, authorize } = require('../middleware/protect')

router.get('/', protect, authorize('admin'), getAllUsers)
router.patch('/me', protect, getMe)

router.patch('/updateVet', protect, saveVet)
router.patch('/userOffline/:id', userOffline)

module.exports = router
