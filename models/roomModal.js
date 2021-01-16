const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter room name'],
  },
  senderName: {
    type: String,
    required: [true, 'Please enter sender name'],
  },
  receiverId: {
    type: String,
    required: [true, 'Please enter receiver id'],
  },
  petId: {
    type: String,
    required: [true, 'Please enter pet id'],
  },
})

module.exports = mongoose.model('Room', roomSchema)
