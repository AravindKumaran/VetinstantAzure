const Chat = require('../models/chatModal')
const AppError = require('../utils/AppError')

exports.saveChat = async (req, res, next) => {
  const newChat = await Chat.create(req.body)

  res.status(201).json({
    status: 'success',
    newChat,
  })
}
exports.getSingleChat = async (req, res, next) => {
  const chat = await Chat.findById(req.params.id)

  if (!chat) {
    return next(new AppError('chat not found', 404))
  }

  res.status(200).json({
    status: 'success',
    chat,
  })
}

exports.getRoomsChat = async (req, res, next) => {
  const chats = await Chat.find({
    roomName: req.params.name,
    petId: req.params.petid,
  }).sort('-createdAt')

  res.status(200).json({
    status: 'success',
    chats,
  })
}
