const Room = require('../models/roomModal')
const AppError = require('../utils/AppError')

exports.createRoom = async (req, res, next) => {
  const { name, senderName, receiverId } = req.body

  const exRoom = await Room.findOne({ name })

  if (exRoom) return res.status(200).json({ status: 'success', room: exRoom })

  const newRoom = await Room.create({ name, senderName, receiverId })

  res.status(201).json({
    status: 'success',
    room: newRoom,
  })
}

exports.getReceiverRoom = async (req, res, next) => {
  const room = await Room.find({ receiverId: req.params.id })

  res.status(200).json({
    status: 'success',
    room,
  })
}
