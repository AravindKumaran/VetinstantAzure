const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      // required: [true, 'Please add a phone number'],
      // validate: {
      //   validator: function (v) {
      //     return v.length === 10 && /^[6-9]\d{9}$/g.test(v)
      //   },
      //   message: 'Please add a valid phone number',
      // },
    },
    file: {
      type: String,
      required: [true, 'Please add a form file'],
    },
    accno: {
      type: String,
      minlength: [9, 'Invalid account no.'],
      required: false
    },
    accname: {
      type: String,
    },
    acctype: {
      type: 'String',
      enum: {
        values: ['savings', 'current'],
        message: 'Account type must be either savings or current',
      },
    },
    ifsc: {
      type: String,
      minlength: [11, 'Invalid IFSC code'],
    },
    fee: {
      type: String,
      // required: [true, 'Please enter your fee'],
    },
    visitFee: {
      type: String,
      // required: [true, 'Please enter your fee'],
    },
    discount: {
      type: String,
      // required: [true, 'Please enter your fee'],
    },
    firstAvailaibeVet: {
      type: Boolean,
      default: false,
    },
    qlf: {
      type: String,
      // required: [true, 'Please enter your Qualifications'],
      enum: {
        values: ['BVSc', 'BVSc& AH', 'MVSc', 'PhD'],
        message: 'Please provide appropriate qualification',
      },
    },
    regNo: {
      type: String,
      // required: [true, 'Please enter your registration number'],
    },
    patientDetails: [
      {
        name: {
          type: String,
          // required: [true, 'Please add your patient name'],
        },
        problem: {
          type: String,
          // required: [true, 'Please add your pet problem'],
        },
        petname: { type: String, 
          // required: [true, 'Please add your pet name'] 
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'Please add user'],
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
