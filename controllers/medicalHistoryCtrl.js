const MedicalHistory = require("../models/medicalHistoryModal");
const AppError = require("../utils/AppError");
const multer = require("multer");

// const multipleUpload = multer({
//   dest: "public/uploads/",
// });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "_" + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const multipleUpload = multer({
  storage: storage,
});

exports.uploadMultipleFiles = multipleUpload.fields([{ name: "medicalFiles" }]);

exports.saveMedicalFiles = async (req, res, next) => {
  if (req?.files?.medicalFiles) {
    const medicalFilesArr = [];
    for (let i = 0; i < req.files.medicalFiles.length; i++) {
      medicalFilesArr.push(req.files.medicalFiles[i]);
    }
    req.body.medicalFiles = medicalFilesArr;
  }

  const newFile = await MedicalHistory.create(req.body);

  res.status(201).json({
    status: "success",
    newFile,
  });
};

exports.getRoomsFiles = async (req, res, next) => {
  const roomFiles = await MedicalHistory.find({
    roomName: req.params.name,
    petId: req.params.petid,
    problemType: req.params.problemType,
  });

  res.status(200).json({
    status: "success",
    roomFiles,
  });
};
exports.getFilesById = async (req, res, next) => {
  const allFiles = await MedicalHistory.find({
    petId: req.params.petid,
    problemType: req.params.problemType,
  });

  res.status(200).json({
    status: "success",
    allFiles,
  });
};
