const mongoose = require('mongoose')

const callLogSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide sender id'],
      ref: 'User',
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide receiver id'],
      ref: 'User',
    },
    callPending: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('CallLog', callLogSchema)
