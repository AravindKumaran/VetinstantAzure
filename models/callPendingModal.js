const mongoose = require('mongoose')

const callPendingSchema = new mongoose.Schema(
  {
    extraInfo: {
      type: String,
    },
    webToken: {
      type: String,
    },
    mobToken: {
      type: String,
    },
    docName: {
      type: String,
      required: [true, 'Please provide doctor name'],
    },
    docId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide doctor id'],
    },
    docFee: {
      type: Number,
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
    userJoined: {
      type: Boolean,
      default: false,
    },
    docJoined: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      required: [true, 'Please provide username'],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide userid'],
    },
    petId: {
      type: mongoose.Schema.ObjectId,
    },
    status: {
      type: String,
      required: [true, 'Please provide status'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CallPending', callPendingSchema)
