const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      validate: {
        validator: function (v) {
          return v.length === 10 && /^[6-9]\d{9}$/g.test(v)
        },
        message: 'Please add a valid phone number',
      },
    },
    file: {
      type: String,
      required: [true, 'Please add a form file'],
    },
    accno: {
      type: String,
      required: [true, 'Please enter your account no.'],
      minlength: [13, 'Invalid account no.'],
    },
    accname: {
      type: String,
      required: [true, 'Please enter your name on card'],
    },
    acctype: {
      type: 'String',
      required: [true, 'Please enter your account type'],
      enum: {
        values: ['savings', 'current'],
        message: 'Account type must be either savings or current',
      },
    },
    ifsc: {
      type: String,
      required: [true, 'Please enter your bank ifsc code'],
      minlength: [11, 'Invalid IFSC code'],
    },
    fee: {
      type: String,
      required: [true, 'Please enter your fee'],
    },
    patientDetails: [
      {
        name: {
          type: String,
          required: [true, 'Please add your patient name'],
        },
        problem: {
          type: String,
          required: [true, 'Please add your pet problem'],
        },
        petname: { type: String, required: [true, 'Please add your pet name'] },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add user'],
    },
    hospital: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hospital',
      required: [true, 'Please add your hospital'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Doctor', doctorSchema)
