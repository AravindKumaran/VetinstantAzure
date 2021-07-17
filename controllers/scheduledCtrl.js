const ScheduledCall = require('../models/scheduleCallModal')

exports.saveScheduledCall = async (req, res, next) => {
  const exSc = await ScheduledCall.findOne({
    userId: req.body.userId,
    doctorId: req.body.doctorId
  })

  if(exSc) {
    const sc = await ScheduledCall.findByIdAndUpdate(
      exSc._id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: 'true',
      sc,
    })
  }

  const sc = await ScheduledCall.create(req.body)

  res.status(201).json({
    success: 'true',
    sc,
  })
}

exports.getScByUser = async (req, res, next) => {
  const scheduledCalls = await ScheduledCall.find({ userId: req.user._id })

  res.status(200).json({
    success: 'true',
    scheduledCalls,
  })
}

exports.getScByUserAndDoc = async (req, res, next) => {
  const scheduledCalls = await ScheduledCall.findOne({ userId: req.params.userId, doctorId: req.params.docId })

  res.status(200).json({
    success: 'true',
    scheduledCalls,
  })
}
