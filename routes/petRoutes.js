const router = require('express').Router()

const {
  getAllPets,
  getSinglePet,
  createPet,
  uploadPetPhoto,
  resizePhoto,
  petProblems,
  petPrescription,
  uploadMultiplePhoto,
  resizeMultiplePhoto,
} = require('../controllers/petCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router.patch(
  '/prescription/:id',
  authorize('doctor'),
  uploadPetPhoto,
  resizePhoto,
  petPrescription
)

// router.use(authorize('user'))

router
  .route('/')
  .get(getAllPets)
  .post(uploadMultiplePhoto, resizeMultiplePhoto, createPet)

router.patch(
  '/problems/:id',
  uploadMultiplePhoto,
  resizeMultiplePhoto,
  petProblems
)

router.get('/:id', getSinglePet)

module.exports = router
