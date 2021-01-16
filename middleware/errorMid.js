const AppError = require('../utils/AppError')
const fs = require('fs')

const errorMid = (err, req, res, next) => {
  if (req.file && req.file.path) {
    fs.unlinkSync(req.file.path)
  }

  let error = { ...err }
  error.message = err.message

  //   console.log(err.name);

  //   Mongoose Bad Object
  if (err.name === 'CastError') {
    console.log(err)
    const message = `Resource not found `
    error = new AppError(message, 404)
  }

  // Mongoose  Duplicate Field
  if (err.code === 11000) {
    const message = 'Duplicate Field Value Entered'
    error = new AppError(message, 400)
  }

  //Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((el) => el.message)
    error = new AppError(message, 400)
  }

  res.status(error.statusCode || 500).json({
    status: 'fail',
    msg: error.message || 'Server Error',
  })
}

module.exports = errorMid
