const User = require('../models/userModel')
const AppError = require('../models/userModel')

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
