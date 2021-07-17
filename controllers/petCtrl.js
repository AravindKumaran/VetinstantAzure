const Pet = require("../models/petModal");
const AppError = require("../utils/AppError");
const multer = require("multer");
const sharp = require("sharp");
const { nanoid } = require("nanoid");
const fs = require("fs");

const multerFilter2 = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image file! Please upload a image file", 400),
      false
    );
  }
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    console.log("file", file);
    cb(null, file.originalname + "_" + Date.now());
  },
});
var upload = multer({ storage: storage, multerFilter2 });

// const upload = multer({
//   // storage: azureMulterStorage,
//   dest: "public/uploads/",
//   fileFilter: multerFilter2,
// });
exports.uploadPetPhoto = upload.single("photo");

const multipleUpload = multer({
  //storage: azureMulterStorage,
  dest: "public/uploads/",
});
// const multipleUpload = multer({
//   storage: storage,
// });

exports.uploadMultiplePhoto = multipleUpload.fields([
  { name: "photo", maxCount: 1 },
  // { name: "images" },
]);

exports.getAllPets = async (req, res, next) => {
  console.log("getAllPets");
  await req.user.populate("pets").execPopulate();
  const pets = req.user.pets;
  res.status(200).json({
    status: "success",
    results: pets.length,
    pets,
  });
};

exports.getSinglePet = async (req, res, next) => {
  const exPet = await Pet.findById(req.params.id);

  if (!exPet) {
    return next(new AppError(`Pet with id ${req.params.id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    exPet,
  });
};

exports.createPet = async (req, res, next) => {
  console.log("create pet called", req);

  if (!req.files.photo) {
    return next(new AppError("Please select an image", 400));
  }

  let values = [];
  // if (req.files.images) {
  //   values = Object.values(req.files.images);
  // }

  if (req.files.photo) {
    console.log("photo", req.files.photo[0]);
    values.push(req.files.photo[0]);
  }

  for (let i = 0; i < values.length; i++) {
    if (!values[i].mimetype.startsWith("image") || values[i].size > 1000000) {
      return next(
        new AppError("Please select an image with size less than 1mb", 400)
      );
    }
  }

  // if (req.files.images) {
  //   const petImages = [];
  //   for (let i = 0; i < req.files.images.length; i++) {
  //     petImages.push(req.files.images[i].url);
  //   }
  //   req.body.petHistoryImages = petImages;
  // }
  //req.body.photo = req.files.photo[0].url;
  req.body.photo = "localhost:8000/uploads/" + req.files.photo[0].filename;
  req.body.owner = req.user._id;
  const newPet = await Pet.create(req.body);
  res.status(201).json({
    status: "success",
    newPet,
  });
};

exports.updatePet = async (req, res, next) => {
  if (req.files?.photo) {
    if (
      !req.files.photo[0].mimetype.startsWith("image") ||
      req.files.photo[0].size > 1000000
    ) {
      return next(
        new AppError("Please select an image with size less than 1mb", 400)
      );
    }
    // req.body.photo = req.files.photo[0].url;
    req.body.photo = "localhost:8000/uploads/" + req.files.photo[0].filename;
  }

  const existingPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!existingPet) {
    return next(new AppError("Pet not found", 404));
  }

  res.status(201).json({
    status: "success",
    updatedPet: existingPet,
  });
};

exports.petProblems = async (req, res, next) => {
  console.log("petProblems", req.body);
  if (req.files.images) {
    let values = Object.values(req.files.images);
    for (let i = 0; i < values.length; i++) {
      if (!values[i].mimetype.startsWith("image") || values[i].size > 1000000) {
        return next(
          new AppError("Please select an image with size less than 1mb", 400)
        );
      }
    }
  }
  if (req.files.images) {
    const petImages = [];
    for (let i = 0; i < req.files.images.length; i++) {
      petImages.push(req.files.images[i].url);
    }
    req.body.images = petImages;
  }
  const bodyProblem = {
    pet: req.body.pet,
    problem: req.body.problem,
    images: req.body.images || null,
    docname: req.body.docname,
    month: req.body.month,
    day: req.body.day,
    comment: req.body.comment,
    Appetite: req.body.Appetite,
    Behaviour: req.body.Behaviour,
    Activity: req.body.Activity,
    Feces: req.body.Feces,
    feces_comment: req.body.feces_comment || null,
    Urine: req.body.Urine,
    urine_comment: req.body.urine_comment || null,
    Eyes: req.body.Eyes,
    Mucous: req.body.Mucous,
    Ears: req.body.Ears,
    Nose: req.body.Nose,
    Skin: req.body.Skin,
    skin_comment: req.body.skin_comment || null,
    Gait: req.body.Gait,
    general_comment: req.body.general_comment || null,
  };

  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      $push: { problems: bodyProblem },
    },
    { new: true, runValidators: true }
  );

  if (!pet) {
    return next(new AppError("Pet not found", 404));
  }
  res.status(200).json({
    status: "success",
    pet,
  });
};
exports.petPrescription = async (req, res, next) => {
  console.log("body", req.body);
  console.log("file", req.file);
  if (req.file && req.file.size > 1000000) {
    return next(
      new AppError(
        "Please select a file of image file of size less than 1Mb",
        400
      )
    );
  }

  if (req.file) {
    req.body.img =
      "localhost:8000/" +
      req.file.filename +
      "." +
      req.file.mimetype.split("/")[1];
  }
  const bodyPrescription = {
    prescription: req.body.prescription,
    img: req.body.img || null,
    docname: req.body.docname,
  };

  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      $push: { prescriptions: bodyPrescription },
    },
    { new: true, runValidators: true }
  );

  if (!pet) {
    return next(new AppError("Pet not found", 404));
  }
  res.status(200).json({
    status: "success",
    pet,
  });
};
