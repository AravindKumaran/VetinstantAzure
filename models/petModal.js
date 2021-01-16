const mongoose = require('mongoose')

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a pet name'],
    },
    type: {
      type: String,
      required: [true, 'Please add pet type'],
      enum: {
        values: ['dog', 'cat', 'other'],
        message: 'Pet type is either: dog,cat,other',
      },
    },
    photo: {
      type: String,
      required: [true, 'Please add  pet photo'],
    },
    breed: {
      type: String,
      required: [true, 'Please add pet breed'],
    },
    gender: {
      type: String,
      required: [true, 'Please add pet gender'],
      enum: {
        values: ['male', 'female'],
        message: 'Gender is either: male or female',
      },
    },
    age: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 1,
    },
    notes: {
      type: String,
      maxlength: 1024,
    },
    problems: [
      {
        problem: {
          type: String,
          required: [true, 'Please tell your pet problem'],
        },
        img: { type: String },
        docname: {
          type: String,
          required: [true, 'Please enter your doc name'],
        },
      },
    ],
    prescriptions: [
      {
        prescription: {
          type: String,
          required: [true, 'Please tell your pet prescription'],
        },
        img: { type: String },
        docname: {
          type: String,
          required: [true, 'Please enter your doctor name'],
        },
        date: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Pet must have a owner'],
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Pet', petSchema)
