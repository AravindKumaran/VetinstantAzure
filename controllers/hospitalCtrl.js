const Hospital = require('../models/hospitalModal')
const User = require('../models/userModel')
const AppError = require('../utils/AppError')

exports.getAllHospitals = async (req, res, next) => {
  const hospitals = await Hospital.find({})

  res.status(200).json({
    status: 'success',
    results: hospitals.length,
    hospitals,
  })
}

exports.hospitalBlock = async (req, res, next) => {
  const hosp = await Hospital.findById(req.params.id)

  if (!hosp) {
    return next(new AppError('Hospital not found', 404))
  }

  hosp.block = !hosp.block

  await hosp.save()

  console.log('Hosp', hosp, hosp.block)

  if (hosp.block === true) {
    const users = await User.updateMany(
      { hospitalId: hosp._id, role: 'doctor' },
      {
        $set: { block: true },
      }
    )
    if (!users) {
      return next(new AppError('Error in updating', 400))
    }
    console.log('users', users)
  } else if (hosp.block === false) {
    const users = await User.updateMany(
      { hospitalId: hosp._id, role: 'doctor' },
      {
        $set: { block: false },
      }
    )
    if (!users) {
      return next(new AppError('Error in updating', 400))
    }
    console.log('users2', users)
  }

  return res.status(200).json({
    status: 'success',
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

  const { name, address } = req.body;

  if(!name || !address) {
    return next(new AppError('Fields missing!', 400))
  }

  const newHospital = await Hospital.create({ name, address });

  res.status(201).json({
    status: 'success',
    newHospital,
  })
}
