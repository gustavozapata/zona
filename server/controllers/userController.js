const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config();

exports.usersAlias = (req, res, next) => {
  req.query.sort = "name";
  req.query.fields = "email,password";
  req.query.limit = "5";
  next();
};

//ZONA
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      user: newUser
    }
  });
  // } catch (err) {
  //   res.status(400)
  // }
});

exports.invitationCode = catchAsync(async (req, res, next) => {
  if (req.body.code === process.env.INVITATION_CODE) {
    res.status(200).json({
      status: "success",
      data: true
    });
  }
});

//FIXME: (GET ALL USERS?)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
  // } catch (err) {
  //   res.status(404)
  // }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user }
  });
  // } catch (err) {
  //   res.status(404)
  // }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: { user }
  });
  // } catch (err) {
  //   res.status(404)
  // }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null
  });
  // } catch (err) {
  //   res.status(404)
  // }
});
//ZONA

exports.checkLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email, password });
  if (user.length > 0) {
    res.json({ logged: true, user: user[0].name });
  } else {
    res.json({ logged: false });
  }
};
