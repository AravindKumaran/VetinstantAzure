const CallLog = require('../models/callLogModal')
const AppError = require('../utils/AppError')

exports.getAllCallLog = async (req, res, next) => {
  const { receiverId, senderId } = req.query
  let query
  if (receiverId) {
    query = CallLog.find({ receiverId })
  } else if (senderId) {
    query = CallLog.find({ senderId })
  } else {
    query = CallLog.find({})
  }

  const callLogs = await query.populate({
    path: 'senderId receiverId',
    select: 'name',
  })

  res.status(200).json({
    status: 'success',
    count: callLogs.length,
    callLogs,
  })
}

exports.saveCallLog = async (req, res, next) => {
  const callLog = await CallLog.create(req.body)

  res.status(201).json({
    status: 'success',
    log: callLog,
  })
}

exports.updatePending = async (req, res, next) => {
  const callLog = await CallLog.findByIdAndUpdate(
    req.params.id,
    {
      callPending: false,
    },
    { new: true, runValidators: true }
  )

  if (!callLog) {
    return next(new AppError('CallLog not found', 404))
  }

  return res.status(200).json({
    status: 'success',
    log: callLog,
  })
}
