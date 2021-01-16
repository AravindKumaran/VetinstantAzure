const Pet = require('../models/petModal')
const AppError = require('../utils/AppError')
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage()

const upload = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
})

exports.uploadPetPhoto = upload.single('photo')
exports.resizePhoto = (req, res, next) => {
  if (!req.file) return next()

  if (!req.file.mimetype.startsWith('image') || req.file.size > 1000000) {
    return next(
      new AppError('Please select an image with size less than 1mb', 400)
    )
  }

  req.file.filename = `img/pet-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/uploads/${req.file.filename}`)

  next()
}

exports.getAllPets = async (req, res, next) => {
  // const pets = await Pet.find({});

  await req.user.populate('pets').execPopulate()
  const pets = req.user.pets
  res.status(200).json({
    status: 'success',
    results: pets.length,
    pets,
  })
}

exports.getSinglePet = async (req, res, next) => {
  const exPet = await Pet.findOne({ _id: req.params.id, owner: req.user._id })

  if (!exPet) {
    return next(new AppError(`Pet with id ${req.params.id} not found`, 404))
  }

  res.status(200).json({
    status: 'success',
    exPet,
  })
}

exports.createPet = async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please select an image', 400))
  }

  req.body.photo = req.file.filename
  req.body.owner = req.user._id
  const newPet = await Pet.create(req.body)

  res.status(201).json({
    status: 'success',
    newPet,
  })
}

exports.petProblems = async (req, res, next) => {
  if (req.file) {
    req.body.img = req.file.filename
  }
  const bodyProblem = {
    problem: req.body.problem,
    img: req.body.img || null,
    docname: req.body.docname,
  }
  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      $push: { problems: bodyProblem },
    },
    { new: true, runValidators: true }
  )

  if (!pet) {
    return next(new AppError('Pet not found', 404))
  }
  res.status(200).json({
    status: 'success',
    pet,
  })
}
exports.petPrescription = async (req, res, next) => {
  if (req.file) {
    req.body.img = req.file.filename
  }
  const bodyPrescription = {
    prescription: req.body.prescription,
    img: req.body.img || null,
    docname: req.body.docname,
  }
  // const pet = await Pet.findById(req.params.id)
  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      $push: { prescriptions: bodyPrescription },
    },
    { new: true, runValidators: true }
  )

  if (!pet) {
    return next(new AppError('Pet not found', 404))
  }
  res.status(200).json({
    status: 'success',
    pet,
  })
}
