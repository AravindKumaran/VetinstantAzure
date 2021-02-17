const router = require('express').Router()

const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require('../controllers/authCtrl')

router.post('/signup', signup)
router.post('/login', login)
router.post('/saveGoogle', googleAuth)

router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:resetToken', resetPassword)

module.exports = router
