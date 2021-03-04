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
    years: {
      type: Number,
      default: 0,
    },
    months: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 1,
    },
    petHistoryImages: [],
    problems: [
      {
        problem: {
          type: String,
          required: [true, 'Please tell your pet problem'],
        },
        images: [],
        docname: {
          type: String,
          required: [true, 'Please enter your doc name'],
        },
        time: {
          type: Number,
          required: [true, 'enter the period of the problem in numbers(days)'],
        },
        Appetite: {
          type: String,
          required: [true, 'Please enter the Appetite'],
        },
        Behaviour: {
          type: String,
          required: [true, 'Please enter the Behaviour'],
        },
        Feces: [
          {
            type: String,
            required: [true, 'Please enter the Feces'],
          },
        ],
        Urine: [
          {
            type: String,
            required: [true, 'Please enter the Urine'],
          },
        ],
        Eyes: {
          type: String,
          required: [true, 'Please enter the Eyes'],
        },
        Mucous: {
          type: String,
          required: [true, 'Please enter the Mucous'],
        },
        Ears: [
          {
            type: String,
            required: [true, 'Please enter the Ears'],
          },
        ],
        Skin: [
          {
            type: String,
            required: [true, 'Please enter the Skin'],
          },
        ],
        Gait: {
          type: String,
          required: [true, 'Please enter the Gait'],
        },
        comment: {
          type: String,
          required: [true, 'Please enter your comment'],
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
