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
    block: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, 'Please add hospital/clinic address']
    }
  },
  { timestamps: true }
)

// hospitalSchema.post('save', async function (next) {
//   if(this.block===true){

//   }else if(this.block === false)
//   next()
// })

module.exports = mongoose.model('Hospital', hospitalSchema)
