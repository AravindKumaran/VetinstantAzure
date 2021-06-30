const Doctor = require('../models/doctorModal')
const multer = require('multer')
const AppError = require('../utils/AppError')
const MulterAzureStorage = require('multer-azure-storage')

const azureMulterStorage = new MulterAzureStorage({
  azureStorageConnectionString: process.env.AZURE_CONN_STRING,
  azureStorageAccount: process.env.AZURE_STR_ACC,
  azureStorageAccessKey: process.env.AZURE_STR_ACC_KEY,
  containerName: 'documents',
  containerSecurity: 'blob',
  // fileName: (file) => `1.png`,
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new AppError('Not an pdf file! Please upload a .pdf file', 400), false)
  }
}

// const upload = multer({
//   storage: azureMulterStorage,
//   fileFilter: multerFilter,
// })

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
      console.log('file in destination', file)
      callback(null, 'uploads/');
  },
  filename: function (request, file, callback) {
      console.log('file', file);
      callback(null, 'doctors_pdf_' + file.originalname + '_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});

const upload = multer({
  storage,
  fileFilter: multerFilter,
})

exports.uploadPdfFile = upload.fields([{ name: 'file', maxCount: 1 }])

exports.getHospitalDoctors = async (req, res, next) => {
  if (!req.params.hospitalId) {
    return next(new AppError('Please provide hospital Id', 400))
  }

  const doctors = await Doctor.find({
    hospital: req.params.hospitalId,
  }).populate({
    path: 'user',
  })

  res.status(200).json({
    status: 'success',
    count: doctors.length,
    doctors,
  })
}
exports.getAllDoctors = async (req, res, next) => {
  const doctors = await Doctor.find({}).populate([
    {
      path: 'user',
      select: '_id name block emailID',
    },
    {
      path: 'hospital',
      select: '_id name block',
    },
  ])

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
  const { accno, accname, acctype, ifsc, fee, reqUser, hospital } = req.body

  // if (reqUser) {
  //   req.user = reqUser
  // }

  console.log('request body', req.body)

  if (fee > 0 && !accno && !accname && !acctype && !ifsc) {
    return next(new AppError('Please provide the values', 400))
  }

  if (!req.files.file) {
    return next(new AppError('Please select a file of .pdf file', 400))
  }

  if (req.files.file[0].size > 1000000) {
    return next(
      new AppError(
        'Please select a file of .pdf file of size less than 1Mb',
        400
      )
    )
  }

  const exDoctor = await Doctor.findOne({ user: req.user.id })
  if (exDoctor) {
    return next(new AppError('You have already added your details!', 400))
  }

  req.body.file = req.files.file[0].path.replace('\\', '/')
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
