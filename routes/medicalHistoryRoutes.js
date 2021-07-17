const router = require("express").Router();
const {
  saveMedicalFiles,
  uploadMultipleFiles,
  getFilesById,
  getRoomsFiles,
} = require("../controllers/medicalHistoryCtrl");

const { protect } = require("../middleware/protect");

router.use(protect);

// router.post('/', saveChat)
router.route("/").post(uploadMultipleFiles, saveMedicalFiles);
router.get("/problemType/:problemType/room/:name/:petid", getRoomsFiles);
router.get("/problemType/:problemType/:petid", getFilesById);

module.exports = router;
