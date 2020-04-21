const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
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

//ZONA
exports.invitationCode = catchAsync(async (req, res, next) => {
  if (req.body.code === process.env.INVITATION_CODE) {
    res.status(200).json({
      status: "success",
      data: true,
    });
  }
});

//FIXME: (GET ALL USERS?)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query).limitFields();
  // features.query.select(["-_id", "-email"]);
  const users = await features.query;

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

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

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
//ZONA

// exports.createUser = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       user: newUser,
//     },
//   });
// });
// exports.checkLogin = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.find({ email, password });
//   if (user.length > 0) {
//     res.json({ logged: true, user: user[0].name });
//   } else {
//     res.json({ logged: false });
//   }
// };
