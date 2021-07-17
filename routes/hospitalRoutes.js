const router = require("express").Router();

const {
  getHospitalDoctors,
  getOtherDoctorDetailFromSameHospital,
} = require("../controllers/doctorCtrl");
const {
  getAllHospitals,
  saveHospitalName,
  updateHospital,
  getSingleHospital,
  hospitalBlock,
} = require("../controllers/hospitalCtrl");

const { protect, authorize } = require("../middleware/protect");

// const doctorRouter = require('./doctorRoutes')

router.route('/').get(getAllHospitals).post(protect, saveHospitalName)
router.patch('/:id', protect, updateHospital);
router.use(protect)

router.use(protect);
router.use("/:hospitalId/doctors", getHospitalDoctors);
router.patch("/block/:id", authorize("admin"), hospitalBlock);
router.route("/:id").get(getSingleHospital);
router.post("/doc", getOtherDoctorDetailFromSameHospital);

module.exports = router;
