const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add hospital name'],
      lowercase: true,
      unique: true,
      maxlength: [100, 'Hospital name must be less than 100 characters'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Hospital', hospitalSchema)
