const Chat = require('../models/chatModal')

exports.saveChat = async (req, res, next) => {
  const newChat = await Chat.create(req.body)

  res.status(201).json({
    status: 'success',
    newChat,
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
