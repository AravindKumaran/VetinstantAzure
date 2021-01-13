const Doctor = require('../models/doctorModal')
const multer = require('multer')
const AppError = require('../utils/AppError')
const fs = require('fs')

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/doc')
  },
  filename: (req, file, cb) => {
    // const ext = file.originalname.split(".")[1];
    cb(null, `doc-${Date.now()}.pdf`)
  },
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new AppError('Not an pdf file! Please upload a .pdf file', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadPdfFile = upload.single('file')

exports.getAllDoctors = async (req, res, next) => {
  let query

  if (req.params.hospitalId) {
    query = Doctor.find({ hospital: req.params.hospitalId }).populate({
      path: 'user',
      select: 'name isOnline',
    })
  } else {
    query = Doctor.find({}).populate({
      path: 'user',
      select: 'name isOnline',
    })
  }

  const doctors = await query

  res.status(200).json({
    status: 'success',
    count: doctors.length,
    doctors,
  })
}

exports.getSingleDoctor = async (req, res, next) => {
  let query = Doctor.findOne({
    user: req.params.id,
  }).populate({
    path: 'user',
    select: 'name emailID isOnline',
  })

  const doctor = await query
  if (!doctor) {
    return next(
      new AppError(`Doctor with give id ${req.params.id} not found`, 404)
    )
  }

  res.status(200).json({
    status: 'success',
    doctor,
  })
}

exports.getDoctorDetail = async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate({
    path: 'hospital',
    select: 'name',
  })

  if (!doctor) {
    return next(
      new AppError(`Doctor with give id ${req.user.id} not found`, 404)
    )
  }

  res.status(200).json({
    status: 'success',
    doctor,
  })
}

exports.saveDoctorDetail = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select a pdf file', 400))
  }

  const exDoctor = await Doctor.findOne({ user: req.user.id })
  if (exDoctor) {
    return next(new AppError('You have already added your details!', 400))
  }

  const filePath = req.file.path
  const fileSize = req.file.size

  if (fileSize > 1000000) {
    // fs.unlinkSync(filePath);
    return next(new AppError('Please upload file of size less than 1 Mb', 400))
  }
  req.body.file = req.file.filename
  req.body.user = req.user.id
  const newDetails = await Doctor.create(req.body)
  res.status(201).json({
    status: 'success',
    newDetails,
  })
}

exports.getOnlineAvailableDoctors = async (req, res, next) => {
  const doctors = await Doctor.find({}).populate([
    {
      path: 'user',
      select: 'name isOnline',
      match: {
        isOnline: true,
      },
    },
    {
      path: 'hospital',
      select: 'name',
    },
  ])

  res.status(200).json({
    status: 'success',
    count: doctors.length,
    doctors,
  })
}

exports.savePatientDetails = async (req, res, next) => {
  const patientData = {
    name: req.body.name,
    problem: req.body.problem,
    petname: req.body.petname,
  }
  const doc = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      $push: { patientDetails: patientData },
    },
    { new: true, runValidators: true }
  )

  if (!doc) {
    return next(new AppError(`Doctor not found with id ${req.params.id}`, 404))
  }

  res.status(200).json({
    status: 'success',
    doc,
  })
}
