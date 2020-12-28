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
  let user
  if (req.user.role === 'doctor') {
    user = await User.findByIdAndUpdate(
      req.user._id,
      { isOnline: true },
      { new: true }
    )
  } else {
    user = req.user
  }
  res.status(200).json({
    status: 'success',
    user,
  })
}

exports.saveVet = async (req, res, next) => {
  const { hospitalId, doctorId } = req.body
  // if(!hospitalId || doctorId){
  //   return next(new AppError('Please provide hospitalId,'))
  // }

  if (hospitalId && doctorId) {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        hospitalId,
        doctorId,
      },
      { new: true }
    )

    // if (!user) {
    //   return next(new AppError('Error in updating!', 400))
    // }

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
