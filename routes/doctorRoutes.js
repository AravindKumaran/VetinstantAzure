// const router = require('express').Router({ mergeParams: true })
const router = require("express").Router();

const {
  saveDoctorDetail,
  uploadPdfFile,
  getAllDoctors,
  getSingleDoctor,
  getOnlineAvailableDoctors,
  getDoctorDetail,
  savePatientDetails,
} = require("../controllers/doctorCtrl");

const { protect, authorize } = require("../middleware/protect");

router.use(protect);

router.route("/").get(getAllDoctors);

router.post("/", authorize("doctor"), uploadPdfFile, saveDoctorDetail);

router.route("/:id").get(getSingleDoctor);

router.patch("/savepatient/:id", savePatientDetails);

router.route("/user/:id").get(authorize("doctor"), getDoctorDetail);

router.route("/online/available").get(getOnlineAvailableDoctors);

module.exports = router;
