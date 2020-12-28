const AppError = require("../utils/AppError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  try {
    const decoded = await jwt.verify(token, process.env.jwt_Secret);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Not  authorized to access this route", 403));
    }

    next();
  };
};
