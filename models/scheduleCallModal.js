const mongoose = require('mongoose')

const scheduledCallSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide user id'],
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide doctor id'],
    },
    doctorName: {
      type: String,
      required: [true, 'Please provide doctor name'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ScheduledCall', scheduledCallSchema)
