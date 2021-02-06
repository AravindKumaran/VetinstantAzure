const ScheduledCall = require('../models/scheduleCallModal')

exports.saveScheduledCall = async (req, res, next) => {
  const sc = await ScheduledCall.create(req.body)

  res.status(201).json({
    success: 'true',
    sc,
  })
}

exports.getScByUser = async (req, res, next) => {
  const scheduledCalls = await ScheduledCall.find({ userId: req.user._id })

  res.status(201).json({
    success: 'true',
    scheduledCalls,
  })
}
