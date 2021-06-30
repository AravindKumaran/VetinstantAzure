const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a pet name"],
    },
    type: {
      type: String,
      required: [true, "Please add pet type"],
      enum: {
        values: ["dog", "cat", "cattle", "sheep/goat", "poultry"],
        message: "Pet type is either: dog,cat,cattle,sheep/goat,poultry",
      },
    },
    photo: {
      type: String,
      required: [true, "Please add  pet photo"],
    },
    breed: {
      type: String,
      required: [true, "Please add pet breed"],
    },
    gender: {
      type: String,
      required: [true, "Please add pet gender"],
      enum: {
        values: ["male", "female"],
        message: "Gender is either: male or female",
      },
    },
    dob: {
      type: Date,
      default: new Date(),
      required: [true, "Please enter the Date of birth"]
    },
    description: {
      type: String,
      required: [true, "Please enter the description"]
    },
    problems: [
      {
        pet: {
          type: String,
          required: [true, "Please enter your pet"],
        },
        problem: {
          type: String,
          required: [true, "Please tell your pet problem"],
        },
        images: [],
        docname: {
          type: String,
          required: [true, "Please enter your doc name"],
        },
        month: {
          type: Number,
          required: [true, "choose the problem period(months)"],
        },
        day: {
          type: Number,
          required: [true, "choose the problem period(days)"],
        },
        comment: {
          type: String,
          required: [true, "Please enter the Comment"],
        },
        Appetite: {
          type: String,
          required: [true, "Please enter the Appetite"],
        },
        Behaviour: {
          type: String,
          required: [true, "Please enter the Behaviour"],
        },
        Activity: {
          type: String,
          required: [true, "Please enter the Activity"],
        },
        Feces: [
          {
            type: String,
            required: [true, "Please enter the Feces"],
          },
        ],
        feces_comment: {
          type: String,
          required: [true, "Please enter the feces comment"],
        },
        Urine: [
          {
            type: String,
            required: [true, "Please enter the Urine"],
          },
        ],
        urine_comment: {
          type: String,
          required: [true, "Please enter the urine comment"],
        },
        Eyes: {
          type: String,
          required: [true, "Please enter the Eyes"],
          // enum: {
          //   values: ['Normal', 'Abnormal Discharged'],
          //   message: 'Eye is either: Normal,Abnormal Discharged',
          // },
        },
        Mucous: {
          type: String,
          required: [true, "Please enter the Mucous"],
        },
        Ears: [
          {
            type: String,
            required: [true, "Please enter the Ears"],
          },
        ],
        Nose: {
          type: String,
          required: [true, "Please enter the Nose"],
        },
        Skin: [
          {
            type: String,
            required: [true, "Please enter the Skin"],
          },
        ],
        skin_comment: {
          type: String,
          required: [true, "Please enter the skin comment"],
        },
        Gait: {
          type: String,
          required: [true, "Please enter the Gait"],
        },
        general_comment: {
          type: String,
          required: [true, "Please enter your general comment"],
        },
      },
    ],
    prescriptions: [
      {
        prescription: {
          type: String,
          required: [true, "Please tell your pet prescription"],
        },
        img: { type: String },
        docname: {
          type: String,
          required: [true, "Please enter your doctor name"],
        },
        date: {
          type: Date,
          default: new Date(),
        },
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Pet must have a owner"],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
