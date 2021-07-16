const router = require('express').Router()

const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  resetPasswordVerifyCode,
  verifyOtp
} = require('../controllers/authCtrl')

const { protect, authorize } = require('../middleware/protect')

router.post('/signup', signup)
router.post('/login', login)
router.post('/saveGoogle', googleAuth)
router.post('/verify', protect, verifyOtp)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:resetToken', resetPassword)
router.post('/resetpasswordmobile', resetPasswordVerifyCode)

module.exports = router
