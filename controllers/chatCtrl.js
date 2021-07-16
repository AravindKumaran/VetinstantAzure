const Chat = require("../models/chatModal");
const AppError = require("../utils/AppError");
const multer = require("multer");

const multipleUpload = multer({
  dest: "public/uploads/",
});

exports.uploadMultipleFiles = multipleUpload.fields([{ name: "chatFiles" }]);

exports.saveChat = async (req, res, next) => {
  console.log("req", req);

  if (req?.files?.chatFiles) {
    const chatFilesArr = [];
    for (let i = 0; i < req.files.chatFiles.length; i++) {
      // chatFilesArr.push(req.files.chatFiles[i].url);
      chatFilesArr.push(req.files.chatFiles[i]);
    }
    req.body.chatFiles = chatFilesArr;
  }

  const newChat = await Chat.create(req.body);

  res.status(201).json({
    status: "success",
    newChat,
  });
};
exports.getSingleChat = async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new AppError("chat not found", 404));
  }

  res.status(200).json({
    status: "success",
    chat,
  });
};

exports.getRoomsChat = async (req, res, next) => {
  const chats = await Chat.find({
    roomName: req.params.name,
    petId: req.params.petid,
  });

  res.status(200).json({
    status: "success",
    chats,
  });
};
