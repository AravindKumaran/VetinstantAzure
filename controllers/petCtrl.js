const Pet = require('../models/petModal')
const AppError = require('../utils/AppError')
const multer = require('multer')
const sharp = require('sharp')
const { nanoid } = require('nanoid')

const multerStorage = multer.memoryStorage()

const upload = multer({
  storage: multerStorage,
  // fileFilter: multerFilter,
})

exports.uploadPetPhoto = upload.single('photo')
// exports.uploadMultiplePhoto = upload.array('images')
exports.uploadMultiplePhoto = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'images' },
])
exports.resizePhoto = (req, res, next) => {
  if (!req.file) return next()

  if (!req.file.mimetype.startsWith('image') || req.file.size > 1000000) {
    return next(
      new AppError('Please select an image with size less than 1mb', 400)
    )
  }

  req.file.filename = `img/pet-${nanoid()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({
      quality: 90,
    })
    .toFile(`public/uploads/${req.file.filename}`)

  next()
}

exports.resizeMultiplePhoto = (req, res, next) => {
  if (!req.files) return next()

  let values = []
  if (req.files.images) {
    values = Object.values(req.files.images)
  }

  if (req.files.photo) {
    values.push(req.files.photo[0])
  }

  if (!values) return next()

  for (let i = 0; i < values.length; i++) {
    if (!values[i].mimetype.startsWith('image') || values[i].size > 1000000) {
      return next(
        new AppError('Please select an image with size less than 1mb', 400)
      )
    }
  }

  for (let i = 0; i < values.length; i++) {
    values[i].filename = `img/pet-${nanoid()}.jpeg`
    sharp(values[i].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90,
      })
      .toFile(`public/uploads/${values[i].filename}`)
  }

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
  // const exPet = await Pet.findOne({ _id: req.params.id, owner: req.user._id })
  const exPet = await Pet.findById(req.params.id)

  if (!exPet) {
    return next(new AppError(`Pet with id ${req.params.id} not found`, 404))
  }

  res.status(200).json({
    status: 'success',
    exPet,
  })
}

exports.createPet = async (req, res, next) => {
  if (!req.files.photo) {
    return next(new AppError('Please select an image', 400))
  }

  if (req.files.images) {
    const petImages = []
    for (let i = 0; i < req.files.images.length; i++) {
      petImages.push(req.files.images[i].filename)
    }
    req.body.petHistoryImages = petImages
  }

  req.body.photo = req.files.photo[0].filename
  req.body.owner = req.user._id
  const newPet = await Pet.create(req.body)

  res.status(201).json({
    status: 'success',
    newPet,
  })
}

exports.petProblems = async (req, res, next) => {
  if (req.files.images) {
    const petImages = []
    for (let i = 0; i < req.files.images.length; i++) {
      petImages.push(req.files.images[i].filename)
    }
    req.body.images = petImages
  }
  const bodyProblem = {
    problem: req.body.problem,
    images: req.body.images || null,
    docname: req.body.docname,
    time: req.body.time,
    Appetite: req.body.Appetite,
    Behaviour: req.body.Behaviour,
    Feces: req.body.Feces,
    Urine: req.body.Urine,
    Eyes: req.body.Eyes,
    Mucous: req.body.Mucous,
    Ears: req.body.Ears,
    Skin: req.body.Skin,
    Gait: req.body.Gait,
    comment: req.body.comment
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
