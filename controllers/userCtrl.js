const User = require('../models/userModel')
const AppError = require('../utils/AppError')
const Razorpay = require('razorpay')
const { nanoid } = require('nanoid')
const crypto = require('crypto')
const twilio = require('twilio')
const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

let rzp = new Razorpay({
  key_id: `${process.env.KEY_ID}`,
  key_secret: `${process.env.KEY_SECRET}`,
})

exports.getAllUsers = async (req, res, next) => {
  const allUsers = await User.find({})

  res.status(200).json({
    status: 'success',
    users: allUsers,
  })
}

exports.getMe = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { isOnline: true },
    { new: true }
  )

  res.status(200).json({
    status: 'success',
    user,
  })
}

exports.userOffline = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isOnline: false },
    { new: true }
  )

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  res.status(200).json({
    status: 'success',
  })
}

exports.saveVet = async (req, res, next) => {
  const { hospitalId, doctorId } = req.body

  if (hospitalId && doctorId) {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        hospitalId,
        doctorId,
      },
      { new: true }
    )
    res.status(200).json({
      status: 'success',
      user,
    })
  } else {
    res.status(200).json({
      status: 'success',
    })
  }
}

exports.payDoctor = async (req, res, next) => {
  const { amt } = req.body

  if (!amt) {
    return next(new AppError('Please provide amount to be paid!', 400))
  }

  const pmt_capture = 1
  const total_amt = amt * 100
  const client_amt = 100 * 100
  const doctor_amt = total_amt - client_amt

  const options = {
    amount: amt * 100,
    currency: 'INR',
    payment_capture: pmt_capture,
    receipt: nanoid(),
    transfers: [
      {
        account: 'acc_GNshkuWPEsnEv8',
        amount: client_amt,
        currency: 'INR',
      },
      {
        account: 'acc_GNsXpmH1lbRehP',
        amount: doctor_amt,
        currency: 'INR',
      },
    ],
  }

  const result = await rzp.orders.create(options)
  console.log(result)
  res.status(200).json({
    status: 'success',
    result,
  })
}

exports.verifyPayment = async (req, res, next) => {
  const { id, paid_id, sign } = req.body

  if (!id || !paid_id || !sign) {
    return next(new AppError('Please provide required values', 400))
  }
  const genSign = `${id}|${paid_id}`
  const expectedSign = crypto
    .createHmac('sha256', `${process.env.KEY_SECRET}`)
    .update(genSign.toString())
    .digest('hex')

  console.log('Gen', genSign)
  console.log('Exp', expectedSign)

  if (expectedSign !== sign) {
    return next(new AppError('Payment Failed!', 400))
  }

  res.status(200).json({
    status: 'success',
    verify: expectedSign === sign,
  })
}

exports.getVideoToken = async (req, res, next) => {
  if (!req.query || !req.query.userName) {
    return res.status(400).send('Username parameter is required')
  }
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_KEY_SID,
    process.env.TWILIO_KEY_SECRET
  )

  // Set the Identity of this token
  accessToken.identity = req.query.userName

  // Grant access to Video
  const grant = new VideoGrant({
    room: 'home',
  })
  accessToken.addGrant(grant)

  // Serialize the token as a JWT
  const jwt = accessToken.toJwt()
  // console.log(accessToken, jwt)
  return res.send(jwt)
}
