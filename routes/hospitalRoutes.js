const router = require('express').Router()

const { getHospitalDoctors } = require('../controllers/doctorCtrl')
const {
  getAllHospitals,
  saveHospitalName,
  getSingleHospital,
  hospitalBlock,
} = require('../controllers/hospitalCtrl')

const { protect, authorize } = require('../middleware/protect')

// const doctorRouter = require('./doctorRoutes')

router.route('/').get(getAllHospitals).post(protect, saveHospitalName)

router.use(protect)

router.use('/:hospitalId/doctors', getHospitalDoctors)
router.patch('/block/:id', authorize('admin'), hospitalBlock)
router.route('/:id').get(getSingleHospital)

module.exports = router
