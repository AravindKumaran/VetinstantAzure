const router = require('express').Router()

const {
  getAllPets,
  getSinglePet,
  createPet,
  uploadPetPhoto,
  resizePhoto,
  petProblems,
  petPrescription,
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

router.route('/').get(getAllPets).post(uploadPetPhoto, resizePhoto, createPet)

router.patch('/problems/:id', uploadPetPhoto, resizePhoto, petProblems)

router.get('/:id', getSinglePet)

module.exports = router
