const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handlerFactory");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.usersAlias = (req, res, next) => {
  req.query.sort = "name";
  req.query.fields = "email,password";
  req.query.limit = "5";
  next();
};

exports.invitationCode = catchAsync(async (req, res, next) => {
  if (req.body.code === process.env.INVITATION_CODE) {
    res.status(200).json({
      status: "success",
      data: true,
    });
  }
});

//ADMIN LEVEL
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User); //not for update password (go to authController for that)
exports.deleteUser = factory.deleteOne(User);
//ADMIN LEVEL

// USER LEVEL
exports.updateMe = catchAsync(async (req, res, next) => {
  //1. create error if user POST password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  //2. filtered out unwanted field names that aren't allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  //3. update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
// USER LEVEL

//FIXME: (OLD CODE) LOGIN
// exports.checkLogin = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.find({ email, password });
//   if (user.length > 0) {
//     res.json({ logged: true, user: user[0].name });
//   } else {
//     res.json({ logged: false });
//   }
// };
