const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please enter userId"],
    },
    userName: {
      type: String,
      required: [true, "Please enter user name"],
    },
    roomName: {
      type: String,
    },
    problemType: {
      type: String,
      required: [true, "Please enter the problem type"],
    },
    petId: {
      type: String,
      required: [true, "Please enter pet id"],
    },
    medicalFiles: [{}],
  },
  { timestamps: true }
);

module.exports = mongoose.model("medicalHistory", medicalHistorySchema);
