const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    emailID: {
      type: String,
      required: [true, 'Please add a email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a Password'],
      minlength: [8, 'Password must be atleast 8 characters'],
      select: false,
    },

    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'doctor'],
        message: 'Role must be user or doctor!',
      },
    },

    hospitalId: {
      type: mongoose.Schema.ObjectId,
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
    },
    isOnline: Boolean,
  },
  { timestamps: true }
)

userSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

module.exports = mongoose.model('User', userSchema)
