const router = require('express').Router()

const {
  getAllPets,
  getSinglePet,
  createPet,
  updatePet,
  uploadPetPhoto,
  petProblems,
  petPrescription,
  uploadMultiplePhoto,
} = require('../controllers/petCtrl')

const { protect, authorize } = require('../middleware/protect')

router.use(protect)

router.patch(
  '/prescription/:id',
  authorize('doctor'),
  uploadPetPhoto,
  petPrescription
)

// router.use(authorize('user'))

router.route('/').get(getAllPets).post(uploadMultiplePhoto, createPet)

router.patch('/problems/:id', uploadMultiplePhoto, petProblems)

router.route('/:id').get(getSinglePet).patch(uploadMultiplePhoto, updatePet)

module.exports = router
