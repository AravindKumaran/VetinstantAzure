const router = require('express').Router()

const {
  getAllUsers,
  getMe,
  saveVet,
  userOffline,
  payDoctor,
  verifyPayment,
  getVideoToken,
} = require('../controllers/userCtrl')

const { protect, authorize } = require('../middleware/protect')

router.get('/', protect, authorize('admin'), getAllUsers)
router.patch('/me', protect, getMe)

router.patch('/updateVet', protect, saveVet)
router.patch('/userOffline/:id', userOffline)

router.post('/paydoctor', protect, authorize('user'), payDoctor)
router.post('/verifyPayment', protect, authorize('user'), verifyPayment)

router.get('/getToken', protect, getVideoToken)

module.exports = router
