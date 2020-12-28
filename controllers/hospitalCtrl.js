const Hospital = require('../models/hospitalModal')
const AppError = require('../utils/AppError')

exports.getAllHospitals = async (req, res, next) => {
  const hospitals = await Hospital.find({})

  res.status(200).json({
    status: 'success',
    results: hospitals.length,
    hospitals,
  })
}

exports.getSingleHospital = async (req, res, next) => {
  const hospital = await Hospital.findById(req.params.id)

  if (!hospital) {
    return next(
      new AppError(`Hospital with id ${req.params.id} not found`, 404)
    )
  }

  res.status(200).json({
    status: 'success',
    hospital,
  })
}

exports.saveHospitalName = async (req, res, next) => {
  const exHospital = await Hospital.findOne({ name: req.body.name })

  if (exHospital) {
    return next(new AppError('Hospital name already exists!', 404))
  }

  const newHospital = await Hospital.create(req.body)

  res.status(201).json({
    status: 'success',
    newHospital,
  })
}
