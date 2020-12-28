const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_Secret);
};

exports.signup = async (req, res, next) => {
  const { name, emailID, password, role } = req.body;
  const exUser = await User.findOne({ emailID });

  if (exUser) {
    return next(new AppError("Email already taken!", 400));
  }

  const newUser = await User.create({ name, emailID, password, role });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
  });
};

exports.login = async (req, res, next) => {
  const { emailID, password } = req.body;

  if (!emailID || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ emailID }).select("+password");

  if (!user) {
    return next(new AppError("Invaild email or password!", 401));
  }

  const isCorrect = await user.correctPassword(password, user.password);

  if (!isCorrect) {
    return next(new AppError("Invaild email or password!", 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
};

exports.googleAuth = async (req, res, next) => {
  const { name, emailID, password, role } = req.body;

  if (!emailID || !password) {
    return next(new AppError("Invalid email or password", 401));
  }

  let exUser = await User.findOne({ emailID });

  if (!exUser) {
    exUser = await User.create({ name, emailID, password, role });
  }

  const token = signToken(exUser._id);

  res.status(201).json({
    status: "success",
    token,
  });
};
