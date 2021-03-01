const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please enter text'],
  },
  createdAt: {
    type: Date,
    required: true,
  },
  user: {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  roomName: {
    type: String,
    required: [true, 'Please enter room name'],
  },
  petId: {
    type: String,
    required: [true, 'Please enter pet id'],
  },
})

module.exports = mongoose.model('Chat', chatSchema)
