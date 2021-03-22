const router = require('express').Router()

const {
  getAllUsers,
  getMe,
  saveVet,
  userOffline,
  payDoctor,
  verifyPayment,
  getVideoToken,
  getUsersByDoctorId,
  savePushToken,
  sendPushNotification,
  getPushToken,
  userBlock,
} = require('../controllers/userCtrl')

const { protect, authorize } = require('../middleware/protect')

router.get('/', protect, authorize('admin'), getAllUsers)
router.patch('/me', protect, getMe)
router.get(
  '/doctors/:doctorId',
  protect,
  authorize('doctor'),
  getUsersByDoctorId
)

router.patch('/updateVet', protect, saveVet)
router.patch('/userOffline/:id', userOffline)

router.patch('/block/:id', protect, authorize('admin'), userBlock)

router.patch('/saveToken', protect, savePushToken)
router.get('/getPushToken/:id', protect, getPushToken)
router.post('/sendNotification', protect, sendPushNotification)

router.post('/paydoctor', protect, authorize('user'), payDoctor)
router.post('/verifyPayment', protect, authorize('user'), verifyPayment)

router.post('/getToken', protect, getVideoToken)

module.exports = router
