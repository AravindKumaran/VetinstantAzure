const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please enter text'],
    },
    userId: {
      type: String,
      required: [true, 'Please enter userId'],
    },
    userName: {
      type: String,
      required: [true, 'Please enter user name'],
    },
    roomName: {
      type: String,
      required: [true, 'Please enter room name'],
    },
    petId: {
      type: String,
      required: [true, 'Please enter pet id'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Chat', chatSchema)
