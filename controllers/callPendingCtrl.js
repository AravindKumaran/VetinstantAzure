const CallPending = require('../models/callPendingModal')
const AppError = require('../utils/AppError')

exports.saveCallPending = async (req, res, next) => {
  const pendingCall = await CallPending.create(req.body)

  res.status(201).json({
    status: 'success',
    call: pendingCall,
  })
}

exports.getCallPendingByUser = async (req, res, next) => {
  if (!req.params.userId) {
    return next(new AppError('Please provide user id', 404))
  }

  const pendingCall = await CallPending.find({
    userId: req.params.userId,
  })

  res.status(200).json({
    status: 'success',
    calls: pendingCall,
  })
}
exports.getCallPendingByDoctor = async (req, res, next) => {
  if (!req.params.userId) {
    return next(new AppError('Please provide user id', 404))
  }

  const pendingCall = await CallPending.find({
    docId: req.params.userId,
  })

  res.status(200).json({
    status: 'success',
    calls: pendingCall,
  })
}

exports.updateCallPending = async (req, res, next) => {
  const pendingCall = await CallPending.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )

  if (!pendingCall) {
    return next(new AppError('Pending call not found!!', 404))
  }

  res.status(200).json({
    status: 'success',
    calls: pendingCall,
  })
}
