const User = require('../models/userModel')
const AppError = require('../utils/AppError')
const Razorpay = require('razorpay')
const { nanoid } = require('nanoid')
const crypto = require('crypto')
const twilio = require('twilio')
const AccessToken = twilio.jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const { Expo } = require('expo-server-sdk')

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

exports.getUsersByDoctorId = async (req, res, next) => {
  const { doctorId } = req.params
  const users = await User.find({ doctorId, role: 'user' }).select(
    '_id name emailID'
  )
  res.status(200).json({
    status: 'success',
    count: users.length,
    users,
  })
}

exports.getMe = async (req, res, next) => {
  // console.log('Req', req.user)
  if (req.user.block === true) {
    return next(new AppError("You're blocked! Please contact admin", 403))
  }
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

exports.userBlock = async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError('User not found', 404))
  }

  user.block = !user.block

  await user.save()

  return res.status(200).json({
    status: 'success',
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
  const { userName, roomName } = req.body
  if (!userName || !roomName) {
    return res.status(400).send('Please provide required fields')
  }
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_KEY_SID,
    process.env.TWILIO_KEY_SECRET
  )

  accessToken.identity = userName

  const grant = new VideoGrant({
    room: roomName,
  })
  accessToken.addGrant(grant)
  console.log(accessToken)
  const jwt = accessToken.toJwt()
  return res.send(jwt)
}

exports.savePushToken = async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if (!user) {
    return next(new AppError('User not found!', 404))
  }

  if (!Expo.isExpoPushToken(req.body.token)) {
    return next(new AppError('Not valid token!', 400))
  }
  if (!user.token) {
    user.token = req.body.token
    await user.save()
  } else if (user.token && user.token !== req.body.token) {
    user.token = req.body.token
    await user.save()
  }

  res.status(200).json({
    success: true,
    user,
  })
}

exports.getPushToken = async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new AppError('User not found!', 404))
  }

  res.status(200).json({
    success: true,
    token: user.token || null,
  })
}

exports.sendPushNotification = async (req, res, next) => {
  const expo = new Expo()
  console.log('REqqBody', req.body)
  const { targetExpoPushToken, message, title, datas } = req.body

  if (!targetExpoPushToken || !message) {
    return next(new AppError('Please provide token and message', 400))
  }

  if (!Expo.isExpoPushToken(targetExpoPushToken)) {
    return next(new AppError('Not valid token!', 400))
  }

  const chunks = expo.chunkPushNotifications([
    {
      to: targetExpoPushToken,
      sound: 'default',
      title: title || '',
      body: message,
      data: datas || {},
    },
  ])

  const sendChunks = async () => {
    chunks.forEach(async (chunk) => {
      console.log('Sending Chunk', chunk)
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk)
        console.log('Tickets', tickets)
      } catch (error) {
        console.log('Error sending chunk', error)
      }
    })
  }
  await sendChunks()

  res.send('Done')
}
