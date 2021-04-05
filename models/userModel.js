const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { Expo } = require('expo-server-sdk')

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

    token: {
      type: String,
      validate: {
        validator: function (tkn) {
          return Expo.isExpoPushToken(tkn)
        },
        message: 'Token is not valid!',
      },
    },

    webToken: {
      type: String,
    },

    hospitalId: {
      type: mongoose.Schema.ObjectId,
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
    },
    isOnline: Boolean,
    block: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
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

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

  return resetToken
}

module.exports = mongoose.model('User', userSchema)
