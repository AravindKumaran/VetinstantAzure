const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const AppError = require('../utils/AppError')
const sendEmail = require('../utils/sendEmail')
const { customAlphabet } = require('nanoid')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_Secret)
}

exports.signup = async (req, res, next) => {
  const { name, emailID, password, role } = req.body
  const exUser = await User.findOne({ emailID })

  if (exUser) {
    return next(new AppError('Email already taken!', 400))
  }

  let block = false

  if (role === 'doctor') {
    block = true
  }

  const newUser = await User.create({ name, emailID, password, role, block })

  // console.log('New User', newUser)
  // let token = ''
  // if (!newUser.block) {
  //   token = signToken(newUser._id)
  // }

  const token = signToken(newUser._id)

  res.status(201).json({
    status: 'success',
    token,
  })
}

exports.login = async (req, res, next) => {
  const { emailID, password } = req.body

  if (!emailID || !password) {
    return next(new AppError('Please provide email and password', 400))
  }

  const user = await User.findOne({ emailID }).select('+password')

  if (!user) {
    return next(new AppError('Invaild email or password!', 401))
  }

  const isCorrect = await user.correctPassword(password, user.password)

  if (!isCorrect) {
    return next(new AppError('Invaild email or password!', 401))
  }

  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token,
  })
}

exports.googleAuth = async (req, res, next) => {
  const { name, emailID, password, role } = req.body

  if (!emailID || !password) {
    return next(new AppError('Invalid email or password', 401))
  }

  let exUser = await User.findOne({ emailID })

  if (exUser) {
    const token = signToken(exUser._id)
    return res.status(400).json({
      msg: 'Email already taken!',
      token,
    })
    return next(new AppError('Email already taken!', 400))
  }

  if (!exUser) {
    let block = false

    if (role === 'doctor') {
      block = true
    }
    exUser = await User.create({ name, emailID, password, role, block })
  }

  const token = signToken(exUser._id)
  res.status(201).json({
    status: 'success',
    token,
  })
}

exports.forgotPassword = async (req, res, next) => {
  const { emailID, forMobilee } = req.body

  if (!emailID) {
    return next(new AppError('Please provide your email address', 400))
  }

  const user = await User.findOne({ emailID }).select('+password')

  if (!user) {
    return next(new AppError('Email could not be sent', 404))
  }

  // if (user.resetPasswordToken && user.resetPasswordExpire) {
  //   return next(new AppError('Email already sent', 404))
  // }

  let message

  if (forMobilee) {
    const uniqueId = customAlphabet('1234567890ajgrwxs', 6)
    user.resetPasswordToken = uniqueId()
    user.resetPasswordExpire = Date.now() + 10 * (60 * 1000)
    await user.save()
    message = `
    <h4>
    You are receiving this because you (or someone else) have requested the reset of the password for your account.
    </h4>

    <p>
       Your Verification Code : <h1> ${user.resetPasswordToken} </h1>
    </p>


    <p>
    If you did not request this, please ignore this email and your password will remain unchanged.
    </p>
  `
  } else {
    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `${process.env.frontend_url}/passwordreset/${resetToken}`

    message = `
    <h4>
    You are receiving this because you (or someone else) have requested the reset of the password for your account.
    </h4>


    <p>
     Please click on the following link, or paste this into your browser to complete the process:
    </p>

    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>


    <p>
    If you did not request this, please ignore this email and your password will remain unchanged.
    </p>
  `
  }

  try {
    await sendEmail({
      to: user.emailID,
      subject: 'Password Reset Request',
      text: message,
    })

    res.status(200).json({ status: 'success', msg: 'Email Sent' })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    return next(new AppError('Email could not be send', 500))
  }
}

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError('Invalid Reset Token', 400))
  }

  if (!req.body.password) {
    return next(new AppError('Please provide your password', 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(201).json({
    status: 'success',
    msg: 'Password Reset Success',
  })
}

exports.resetPasswordVerifyCode = async (req, res, next) => {
  const { code } = req.body

  if (!code) {
    return next(new AppError('Invalid Code', 400))
  }

  const user = await User.findOne({
    resetPasswordToken: req.body.code,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new AppError('Invalid Reset Token', 400))
  }

  if (!req.body.password) {
    return next(new AppError('Please provide your password', 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(201).json({
    status: 'success',
    msg: 'Password Reset Success',
  })
}

exports.verifyOtp = async (req, res, next) => {
  const user = await User.findOneAndUpdate({
    _id: req.user._id,
    otp: req.body.otp
  },
  {
    $set: { isVerified: true }  
  },
  { new: true }
  )
  if(!user) {
    return res.status(404).json({
      status: 'failed',
      msg: 'Invalid OTP!'
    })
  }
  return res.status(200).json({
    status: 'success',
    msg: 'OTP Verified'
  })
}
