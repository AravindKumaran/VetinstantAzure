const AppError = require('../utils/AppError')

const errorMid = (err, req, res, next) => {
  // fs.writeFileSync('./abc.text', `${JSON.stringify(err)}\n\n`, { flag: 'a' })
  // console.log('Error', err)

  // if (req.files && req.files.file) {
  //   fs.unlinkSync(req.files.file[0].path)
  // }

  let error = { ...err }
  error.message = err.message

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
