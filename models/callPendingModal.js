const mongoose = require('mongoose')
const { Expo } = require('expo-server-sdk')

const callPendingSchema = new mongoose.Schema(
  {
    extraInfo: {
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
    hospId: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Please provide hospital id'],
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
    docMobToken: {
      type: String,
      validate: {
        validator: function (tkn) {
          return Expo.isExpoPushToken(tkn)
        },
        message: 'Doc Token is not valid!',
      },
    },
    userMobToken: {
      type: String,
      validate: {
        validator: function (tkn) {
          return Expo.isExpoPushToken(tkn)
        },
        message: 'User Token is not valid!',
      },
    },
    deleteAfter: {
      type: Date,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('CallPending', callPendingSchema)
