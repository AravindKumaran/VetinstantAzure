const router = require('express').Router()

const {
  getAllHospitals,
  saveHospitalName,
  getSingleHospital,
} = require('../controllers/hospitalCtrl')

const { protect, authorize } = require('../middleware/protect')

const doctorRouter = require('./doctorRoutes')

router.use(protect)
// router.use(authorize('doctor'))

router.use('/:hospitalId/doctors', doctorRouter)

router.route('/').get(getAllHospitals).post(saveHospitalName)

router.route('/:id').get(getSingleHospital)

module.exports = router
