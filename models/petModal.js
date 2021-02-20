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
        time:{
          type: Number,
          required: [true, 'enter the period of the problem in numbers(days)'],
        },
        Appetite:{
          type: String,
          required: [true, 'Please enter the Appetite'],
          enum: {
            values: ['Normal', 'Not Observed', 'Different from Normal'],
            message: 'Appetite is either: Normal,Not Observed,Different from Normal',
          },
        },
        Behaviour:{
          type: String,
          required: [true, 'Please enter the Behaviour'],
          enum: {
            values: ['Normal', 'Not Observed', 'Different from Normal'],
            message: 'Behaviour is either: Normal,Not Observed,Different from Normal',
          },
        },
        Feces:{
          type: String,
          required: [true, 'Please enter the Feces'],
          enum: {
            values: ['Normal', 'Not Observed', 'Abnormal Colour', 'Worms'],
            message: 'Feces is either: Normal,Not Observed,Abnormal Colour,Worms',
          },
        },
        Urine:{
          type: String,
          required: [true, 'Please enter the Urine'],
          enum: {
            values: ['Normal', 'Not Observed', 'Abnormal Colour'],
            message: 'Pet type is either: Normal,Not Observed,Abnormal Colour',
          },
        },
        Eyes:{
          type: String,
          required: [true, 'Please enter the Eyes'],
          enum: {
            values: ['Normal', 'Abnormal Discharged', 'Kotlin'],
            message: 'Eye is either: Normal,Abnormal Discharged,Kotlin',
          },
        },
        Mucous:{
          type: String,
          required: [true, 'Please enter the Mucous'],
          enum: {
            values: ['White', 'Pink-White', 'Pink', 'Red-Pink', 'Red', 'Dark Red', 'Yellow'],
            message: 'Mucous is either: ,White,Pink-White,Pink,Red-Pink,Red,Dark Red,Yellow',
          },
        },
        Ears:{
          type: String,
          required: [true, 'Please enter the Ears'],
          enum: {
            values: ['Normal', 'Abnormal Discharge', 'Abnormal Odour', 'Abnormal appearance'],
            message: 'Ear is either: Normal,Abnormal Discharge,Abnormal Odour,Abnormal appearance',
          },
        },
        Skin:{
          type: String,
          required: [true, 'Please enter the Skin'],
          enum: {
            values: ['Normal', 'Injuries', 'Odour', 'Hairfall', 'Rough Coat', 'Changes in Appearance'],
            message: 'Skin is either: Normal,Injuries,Odour,Hairfall,Rough Coat,Changes in Appearance',
          },
        },
        Gait:{
          type: String,
          required: [true, 'Please enter the Gait'],
          enum: {
            values: ['Normal', 'Not Observed', 'Different from Normal'],
            message: 'Gait is either: Normal,Not Observed,Different from Normal',
          },
        },
        comment:{
          type: String,
          required: [true, 'Please enter your comment'],
        }
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
